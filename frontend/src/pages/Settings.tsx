import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Phone, User, Lock, AlertCircle } from 'lucide-react';
import { useEmergencyContact } from '@/hooks/useEmergencyContact';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserRole } from '@/hooks/useUserRole';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Default emergency contact values
const DEFAULT_EMERGENCY_NAME = 'Aditya Patel';
const DEFAULT_EMERGENCY_PHONE = '9546530546';

export default function Settings() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { contact, isLoading: isContactLoading, updateContact, isUpdating } = useEmergencyContact();
  const { userProfile, isLoading: isProfileLoading, isFetched: isProfileFetched, saveProfile, isSaving } = useUserProfile();
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();
  
  const [fullName, setFullName] = useState(DEFAULT_EMERGENCY_NAME);
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_EMERGENCY_PHONE);
  const [errors, setErrors] = useState<{ fullName?: string; phoneNumber?: string }>({});

  const isAuthenticated = !!identity;
  const isLoading = isContactLoading || isRoleLoading;

  // Auto-save user profile with default values on first load if no profile exists
  useEffect(() => {
    if (isAuthenticated && isProfileFetched && userProfile === null && !isSaving) {
      saveProfile().catch((error) => {
        console.error('Failed to auto-save user profile:', error);
      });
    }
  }, [isAuthenticated, isProfileFetched, userProfile, isSaving, saveProfile]);

  useEffect(() => {
    if (contact) {
      setFullName(contact.fullName);
      setPhoneNumber(contact.number);
    } else if (!isContactLoading) {
      // No contact saved yet — pre-fill with defaults
      setFullName(DEFAULT_EMERGENCY_NAME);
      setPhoneNumber(DEFAULT_EMERGENCY_PHONE);
    }
  }, [contact, isContactLoading]);

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(number.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('Unauthorized', {
        description: 'Only the administrator can modify emergency contact information.',
      });
      return;
    }
    
    const newErrors: { fullName?: string; phoneNumber?: string } = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      await updateContact(fullName.trim(), phoneNumber.trim());
      toast.success('Emergency contact saved successfully!', {
        description: 'Your emergency contact has been updated.',
      });
    } catch (error) {
      toast.error('Failed to save contact', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (errors.fullName) {
      setErrors({ ...errors, fullName: undefined });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: undefined });
    }
  };

  // Determine what to display for user profile
  const displayUserProfile = userProfile || (isProfileFetched && !userProfile ? {
    name: 'Aditya Patel',
    phoneNumber: '9546530546'
  } : null);

  // The contact to display in read-only view
  const displayContact = contact ?? { fullName: DEFAULT_EMERGENCY_NAME, number: DEFAULT_EMERGENCY_PHONE };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <Alert className="border-warning bg-warning/10">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            Please log in to view or manage emergency contact settings.
          </AlertDescription>
        </Alert>

        {/* Show emergency contact even when not logged in */}
        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Emergency Contact
            </CardTitle>
            <CardDescription>Call this number in case of emergency — no login required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2 py-4">
              <p className="text-2xl font-bold text-foreground">{DEFAULT_EMERGENCY_NAME}</p>
              <a
                href={`tel:${DEFAULT_EMERGENCY_PHONE}`}
                className="text-3xl font-extrabold text-primary tracking-widest hover:underline block"
              >
                {DEFAULT_EMERGENCY_PHONE}
              </a>
            </div>
            <Button
              size="lg"
              className="w-full h-12 text-base font-bold bg-emergency hover:bg-emergency/90 text-white"
              onClick={() => window.location.href = `tel:${DEFAULT_EMERGENCY_PHONE}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              CALL NOW — {DEFAULT_EMERGENCY_PHONE}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* User Profile Card */}
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            Your Profile
          </CardTitle>
          <CardDescription className="text-base">
            Your personal information saved in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProfileLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-muted animate-pulse rounded-md" />
              <div className="h-12 bg-muted animate-pulse rounded-md" />
            </div>
          ) : displayUserProfile ? (
            <div className="space-y-6">
              {/* Name Display */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Name
                </Label>
                <div className="h-12 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-base">
                  {displayUserProfile.name}
                </div>
              </div>

              {/* Phone Number Display */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <div className="h-12 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-base">
                  {displayUserProfile.phoneNumber}
                </div>
              </div>
            </div>
          ) : (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Setting up your profile...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact Card */}
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            Emergency Contact Settings
            {!isAdmin && !isLoading && (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription className="text-base">
            {isAdmin 
              ? 'Set up your trusted emergency contact who will be called when you need help'
              : 'View the emergency contact information configured by your administrator'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && !isAdmin && (
            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <Lock className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                Only the administrator can modify this information. You can view and use the emergency contact for safety purposes.
              </AlertDescription>
            </Alert>
          )}

          {isAdmin ? (
            // Admin View - Editable Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Contact Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter contact's full name"
                  value={fullName}
                  onChange={handleNameChange}
                  className={`h-12 text-base ${errors.fullName ? 'border-destructive' : ''}`}
                  disabled={isUpdating}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="9546530546"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`h-12 text-base ${errors.phoneNumber ? 'border-destructive' : ''}`}
                  disabled={isUpdating}
                  autoComplete="tel"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Include country code for international numbers (e.g., +91 for India)
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Emergency Contact
                  </>
                )}
              </Button>
            </form>
          ) : (
            // Non-Admin View - Read-Only Display
            <div className="space-y-6">
              {/* Full Name Display */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Contact Name
                </Label>
                <div className="h-12 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-base">
                  {displayContact.fullName}
                </div>
              </div>

              {/* Phone Number Display */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <div className="h-12 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center text-base font-semibold text-primary">
                  {displayContact.number}
                </div>
              </div>

              {/* Call Button for Non-Admin */}
              <Button
                type="button"
                size="lg"
                className="w-full h-12 text-base font-semibold bg-emergency hover:bg-emergency/90 text-white"
                onClick={() => window.location.href = `tel:${displayContact.number}`}
              >
                <Phone className="mr-2 h-5 w-5" />
                CALL NOW — {displayContact.number}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
