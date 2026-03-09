import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text; phoneNumber : Text }>;
    emergencyContact : ?{ fullName : Text; number : Text };
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text; phoneNumber : Text }>;
    emergencyContact : { fullName : Text; number : Text };
  };

  public func run(old : OldActor) : NewActor {
    let newEmergencyContact : { fullName : Text; number : Text } = switch (old.emergencyContact) {
      case (?contact) { contact };
      case (null) {
        {
          fullName = "Aditya Patel";
          number = "9546530546";
        };
      };
    };
    {
      userProfiles = old.userProfiles;
      emergencyContact = newEmergencyContact;
    };
  };
};
