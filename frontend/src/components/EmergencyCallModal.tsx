import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
import type { EmergencyContact } from '@/backend';

interface EmergencyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: EmergencyContact;
}

export default function EmergencyCallModal({ isOpen, onClose, contact }: EmergencyCallModalProps) {
  const handleCall = () => {
    window.location.href = `tel:${contact.number}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Emergency Call</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You are about to call your emergency contact
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="bg-secondary/30 rounded-lg p-6 space-y-3 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Calling</p>
              <p className="text-2xl font-bold text-foreground">{contact.fullName}</p>
              <p className="text-lg text-muted-foreground mt-2">{contact.number}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCall}
              size="lg"
              className="w-full h-14 text-lg font-bold bg-emergency hover:bg-emergency/90 text-white"
            >
              <Phone className="mr-2 h-6 w-6" />
              CALL NOW
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full h-12"
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
          </div>

          {/* Safety Note */}
          <p className="text-xs text-center text-muted-foreground px-4">
            Your phone's dialer will open. Make sure you're in a safe location before calling.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
