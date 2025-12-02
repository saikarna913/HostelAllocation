import { useState } from 'react';
import { Room } from '@/types/hostel';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoomCellProps {
  room: Room;
  onClick?: (room: Room) => void;
}

export function RoomCell({ room, onClick }: RoomCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusClass = {
    vacant: 'room-vacant',
    occupied: 'room-occupied',
    reserved: 'room-reserved',
  }[room.status];

  const statusIcon = {
    vacant: null,
    occupied: room.occupants.length > 1 ? Users : User,
    reserved: null,
  }[room.status];

  const Icon = statusIcon;

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <button
          className={cn(
            'room-cell w-14 h-14 md:w-16 md:h-16',
            statusClass,
            isHovered && 'z-10'
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onClick?.(room)}
          aria-label={`Room ${room.label}, ${room.status}, ${room.occupants.length} occupants`}
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span className="font-mono text-xs font-semibold text-foreground/80">
              {room.label}
            </span>
            {Icon && (
              <Icon className="h-3.5 w-3.5 text-foreground/60" />
            )}
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="p-0 overflow-hidden"
        sideOffset={8}
      >
        <div className="min-w-[200px]">
          {/* Header */}
          <div className={cn(
            'px-3 py-2 text-sm font-medium',
            room.status === 'vacant' && 'bg-room-vacant text-primary-foreground',
            room.status === 'occupied' && 'bg-room-occupied text-primary-foreground',
            room.status === 'reserved' && 'bg-room-reserved text-primary-foreground',
          )}>
            Room {room.label}
            <span className="ml-2 text-xs opacity-80 capitalize">
              ({room.status})
            </span>
          </div>
          
          {/* Content */}
          <div className="p-3 bg-popover">
            {room.status === 'vacant' && (
              <p className="text-sm text-muted-foreground">
                No occupants • Capacity: {room.capacity}
              </p>
            )}
            
            {room.status === 'reserved' && (
              <p className="text-sm text-muted-foreground">
                Reserved for allocation
              </p>
            )}
            
            {room.status === 'occupied' && room.occupants.length > 0 && (
              <div className="space-y-2">
                {room.occupants.map((occupant, idx) => (
                  <div key={occupant.studentId} className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">
                        {occupant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {occupant.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {occupant.course} • Year {occupant.year}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                  {room.occupants.length}/{room.capacity} beds occupied
                </p>
              </div>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
