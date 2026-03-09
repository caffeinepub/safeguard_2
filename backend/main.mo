import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    phoneNumber : Text;
  };

  public type EmergencyContact = {
    fullName : Text;
    number : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var emergencyContact : EmergencyContact = {
    fullName = "Aditya Patel";
    number = "9546530546";
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let profile : UserProfile = {
      name = "Aaditya patel";
      phoneNumber = "7654552061";
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func setEmergencyContact(contact : EmergencyContact) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can set the emergency contact");
    };
    emergencyContact := contact;
  };

  public query func getEmergencyContact() : async EmergencyContact {
    emergencyContact;
  };
};
