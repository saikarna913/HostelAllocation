import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface FloorSelectorProps {
  floors: number[];
  selectedFloor: number;
  onSelectFloor: (floor: number) => void;
  floorStats?: Record<number, { occupied: number; total: number }>;
}

export function FloorSelector({
  floors,
  selectedFloor,
  onSelectFloor,
  floorStats,
}: FloorSelectorProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Layers className="h-5 w-5" />
        <span className="font-medium text-sm">Floor</span>
      </div>
      <div className="flex items-center gap-2">
        {floors.map((floor) => {
          const stats = floorStats?.[floor];
          const occupancyRate = stats ? Math.round((stats.occupied / stats.total) * 100) : 0;
          
          return (
            <Button
              key={floor}
              variant={selectedFloor === floor ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectFloor(floor)}
              className={cn(
                'min-w-[60px] relative',
                selectedFloor === floor && 'shadow-md'
              )}
            >
              <span className="font-mono">{floor}</span>
              {stats && selectedFloor !== floor && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full"
                  style={{
                    width: `${Math.max(20, occupancyRate * 0.4)}px`,
                    backgroundColor: occupancyRate > 80 
                      ? 'hsl(var(--room-occupied))' 
                      : occupancyRate > 50 
                        ? 'hsl(var(--room-vacant))' 
                        : 'hsl(var(--muted-foreground))',
                  }}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}