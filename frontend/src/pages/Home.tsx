import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, ShieldCheck, Users, Baby } from 'lucide-react';
import EmergencyCallModal from '@/components/EmergencyCallModal';
import { useEmergencyContact } from '@/hooks/useEmergencyContact';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

const DEFAULT_CONTACT = {
  fullName: 'Aditya Patel',
  number: '9546530546',
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { contact, isLoading } = useEmergencyContact();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Use fetched contact if available, otherwise fall back to default
  const activeContact = contact ?? DEFAULT_CONTACT;

  const handleEmergencyClick = () => {
    setIsModalOpen(true);
  };

  const handleDirectCall = () => {
    window.location.href = `tel:${activeContact.number}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] max-w-2xl mx-auto">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/assets/generated/hero-safety.dim_1200x600.png)' }}
        />
      </div>

      <div className="text-center space-y-8 w-full px-4">
        {/* Title Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Safety Helpline</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Musibat Mein Hain?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Koi bhi ladki, ladka ya bachcha — kabhi bhi, kisi bhi musibat mein — neeche diye number par call karein
          </p>
        </div>

        {/* Who Can Call Section */}
        <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Ladkiyan
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Ladke
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground">
            <Baby className="h-4 w-4 text-primary" />
            Bachche
          </div>
        </div>

        {/* Contact Card - Always Visible */}
        <div className="max-w-sm mx-auto bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-lg space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Emergency Contact</p>
          <p className="text-2xl font-bold text-foreground">{isLoading ? DEFAULT_CONTACT.fullName : activeContact.fullName}</p>
          <a
            href={`tel:${isLoading ? DEFAULT_CONTACT.number : activeContact.number}`}
            className="text-3xl font-extrabold text-primary tracking-widest hover:underline block"
          >
            {isLoading ? DEFAULT_CONTACT.number : activeContact.number}
          </a>
          <p className="text-xs text-muted-foreground pt-1">24/7 Safety Helpline — Free to Call</p>
        </div>

        {/* Emergency Button */}
        <div className="flex flex-col items-center gap-6 py-4">
          <button
            onClick={handleEmergencyClick}
            disabled={isLoading}
            className="group relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-emergency via-emergency to-emergency/80 shadow-2xl hover:shadow-emergency/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-emergency/50"
            aria-label="Emergency Call Button"
          >
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
            <div className="relative flex flex-col items-center justify-center h-full gap-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <img
                  src="/assets/generated/emergency-icon.dim_128x128.png"
                  alt="Emergency"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </div>
              <div className="text-white">
                <p className="text-2xl md:text-3xl font-bold tracking-wide">EMERGENCY</p>
                <p className="text-sm md:text-base font-medium opacity-90">Tap to Call</p>
              </div>
            </div>
          </button>

          {/* Direct Call Button - Always accessible */}
          <Button
            size="lg"
            className="w-full max-w-xs h-14 text-lg font-bold bg-emergency hover:bg-emergency/90 text-white shadow-lg"
            onClick={handleDirectCall}
          >
            <Phone className="mr-2 h-6 w-6" />
            ABHI CALL KAREIN
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Login ki zaroorat nahi — seedha call karein
          </p>
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto space-y-3 pt-2 pb-8">
          <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-card border border-border">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Kab Call Karein?</h3>
              <p className="text-sm text-muted-foreground">
                Kisi bhi khatarnak situation mein — raaste mein, ghar mein, ya kisi bhi jagah — bina der kiye call karein
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-card border border-border">
            <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Turant Madad</h3>
              <p className="text-sm text-muted-foreground">
                Aditya Patel aapki madad ke liye hamesha taiyaar hain — din ho ya raat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Call Modal */}
      <EmergencyCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={isLoading ? DEFAULT_CONTACT : activeContact}
      />
    </div>
  );
}
