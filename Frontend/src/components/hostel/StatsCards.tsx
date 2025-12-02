import { Building2, Users, DoorOpen, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    totalRooms: number;
    occupied: number;
    vacant: number;
    reserved: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupied / stats.totalRooms) * 100) 
    : 0;

  const cards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Occupied',
      value: stats.occupied,
      icon: Users,
      color: 'text-room-occupied',
      bgColor: 'bg-room-occupied/10',
      suffix: `${occupancyRate}%`,
    },
    {
      title: 'Vacant',
      value: stats.vacant,
      icon: DoorOpen,
      color: 'text-room-vacant',
      bgColor: 'bg-room-vacant/10',
    },
    {
      title: 'Reserved',
      value: stats.reserved,
      icon: Clock,
      color: 'text-room-reserved',
      bgColor: 'bg-room-reserved/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{card.value}</p>
                  {card.suffix && (
                    <span className={cn('text-sm font-medium', card.color)}>
                      {card.suffix}
                    </span>
                  )}
                </div>
              </div>
              <div className={cn('p-2 rounded-lg', card.bgColor)}>
                <card.icon className={cn('h-5 w-5', card.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
