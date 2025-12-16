import { Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { hostelMetaMap } from '@/layouts';

export function WelcomeCard() {
  const navigate = useNavigate();

  const hostels = Object.values(hostelMetaMap);
  const firstHostel = hostels[0];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-xl font-bold mb-2">Welcome to HostelMS</h2>
          <p className="text-muted-foreground mb-6">
            Select a hostel to view rooms and manage allocations.
          </p>

          {firstHostel && (
            <Button
              onClick={() =>
                navigate(`/hostels/${firstHostel.id}/floor/0`)
              }
            >
              Select {firstHostel.name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
