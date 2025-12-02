import { Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeCardProps {
  onSelectHostel: () => void;
}

export function WelcomeCard({ onSelectHostel }: WelcomeCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to HostelMS</h2>
          <p className="text-muted-foreground mb-6">
            Select a hostel from the sidebar to view floor plans, room occupancy, 
            and manage student allocations.
          </p>
          <Button onClick={onSelectHostel} className="gap-2">
            Select a Hostel
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
