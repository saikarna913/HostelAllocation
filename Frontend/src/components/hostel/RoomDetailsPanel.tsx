import { Room } from '@/types/hostel';
import { X, User, Calendar, BookOpen, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoomDetailsPanelProps {
  room: Room | null;
  onClose: () => void;
}

export function RoomDetailsPanel({ room, onClose }: RoomDetailsPanelProps) {
  if (!room) return null;

  const statusConfig = {
    vacant: { label: 'Vacant', color: 'bg-room-vacant' },
    occupied: { label: 'Occupied', color: 'bg-room-occupied' },
    reserved: { label: 'Reserved', color: 'bg-room-reserved' },
  };

  const status = statusConfig[room.status];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-border shadow-xl z-50 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold">Room {room.label}</h2>
          <p className="text-sm text-muted-foreground">
            Floor {room.floor} • Capacity: {room.capacity}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', status.color)} />
          <span className="font-medium">{status.label}</span>
          <Badge variant="secondary" className="ml-auto">
            {room.occupants.length}/{room.capacity} beds
          </Badge>
        </div>
      </div>

      {/* Occupants */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Occupants
        </h3>
        
        {room.occupants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No occupants assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            {room.occupants.map((occupant) => (
              <div
                key={occupant.studentId}
                className="p-4 bg-secondary/50 rounded-lg space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {occupant.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{occupant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {occupant.studentId}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{occupant.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>Year {occupant.year}</span>
                  </div>
                  {occupant.checkinDate && (
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Checked in: {new Date(occupant.checkinDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          {room.status === 'vacant' && (
            <Button className="flex-1">Assign Student</Button>
          )}
          {room.status === 'occupied' && (
            <>
              <Button variant="outline" className="flex-1">Edit</Button>
              <Button variant="destructive" className="flex-1">Vacate Room</Button>
            </>
          )}
          {room.status === 'reserved' && (
            <Button className="flex-1">Confirm Allocation</Button>
          )}
        </div>
      </div>
    </div>
  );
}
