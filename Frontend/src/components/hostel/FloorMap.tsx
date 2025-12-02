import { useMemo } from 'react';
import { Room } from '@/types/hostel';
import { RoomCell } from './RoomCell';
import { cn } from '@/lib/utils';

interface FloorMapProps {
  rooms: Room[];
  hostelCode: string;
  floorNumber: number;
  onRoomClick?: (room: Room) => void;
}

export function FloorMap({ rooms, hostelCode, floorNumber, onRoomClick }: FloorMapProps) {
  // Organize rooms by their position in the E-shape
  const organizedRooms = useMemo(() => {
    const roomsByRow: Record<number, Room[]> = {};
    rooms.forEach((room) => {
      if (!roomsByRow[room.position.row]) {
        roomsByRow[room.position.row] = [];
      }
      roomsByRow[room.position.row].push(room);
    });
    
    // Sort rooms in each row by column
    Object.values(roomsByRow).forEach((rowRooms) => {
      rowRooms.sort((a, b) => a.position.col - b.position.col);
    });
    
    return roomsByRow;
  }, [rooms]);

  const renderRoomRow = (rowIndex: number) => {
    const rowRooms = organizedRooms[rowIndex] || [];
    return (
      <div className="flex items-center gap-2">
        {rowRooms.map((room) => (
          <RoomCell key={room.id} room={room} onClick={onRoomClick} />
        ))}
      </div>
    );
  };

  return (
    <div className="floor-grid animate-fade-in">
      {/* Floor Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Floor {floorNumber} Layout
          </h2>
          <p className="text-sm text-muted-foreground">
            Hostel {hostelCode} • {rooms.length} rooms
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-room-vacant-bg border-2 border-room-vacant" />
            <span className="text-muted-foreground">Vacant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-room-occupied-bg border-2 border-room-occupied" />
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-room-reserved-bg border-2 border-room-reserved" />
            <span className="text-muted-foreground">Reserved</span>
          </div>
        </div>
      </div>

      {/* E-Shape Layout */}
      <div className="relative space-y-2">
        {/* Top Bar - Row 0 */}
        <div className="flex items-center">
          <div className="flex-shrink-0 w-16 text-right pr-3">
            <span className="text-xs font-mono text-muted-foreground">Wing A</span>
          </div>
          {renderRoomRow(0)}
        </div>

        {/* Corridor between top and middle */}
        <div className="flex items-center h-8">
          <div className="flex-shrink-0 w-16" />
          <div className="flex-1 flex items-center gap-2">
            <div className="w-14 md:w-16 h-full flex items-center justify-center">
              <div className="w-1 h-full bg-floor-corridor rounded" />
            </div>
            <div className="flex-1 border-t-2 border-dashed border-floor-corridor" />
          </div>
        </div>

        {/* Middle Bar - Row 2 */}
        <div className="flex items-center">
          <div className="flex-shrink-0 w-16 text-right pr-3">
            <span className="text-xs font-mono text-muted-foreground">Wing B</span>
          </div>
          {renderRoomRow(2)}
        </div>

        {/* Corridor between middle and bottom */}
        <div className="flex items-center h-8">
          <div className="flex-shrink-0 w-16" />
          <div className="flex-1 flex items-center gap-2">
            <div className="w-14 md:w-16 h-full flex items-center justify-center">
              <div className="w-1 h-full bg-floor-corridor rounded" />
            </div>
            <div className="flex-1 border-t-2 border-dashed border-floor-corridor" />
          </div>
        </div>

        {/* Bottom Bar - Row 4 */}
        <div className="flex items-center">
          <div className="flex-shrink-0 w-16 text-right pr-3">
            <span className="text-xs font-mono text-muted-foreground">Wing C</span>
          </div>
          {renderRoomRow(4)}
        </div>

        {/* Vertical spine indicator */}
        <div 
          className="absolute left-16 top-0 bottom-0 w-16 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--floor-corridor) / 0.3) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Floor Stats */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-muted-foreground">Vacant: </span>
            <span className="font-semibold text-room-vacant">
              {rooms.filter((r) => r.status === 'vacant').length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Occupied: </span>
            <span className="font-semibold text-room-occupied">
              {rooms.filter((r) => r.status === 'occupied').length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Reserved: </span>
            <span className="font-semibold text-room-reserved">
              {rooms.filter((r) => r.status === 'reserved').length}
            </span>
          </div>
        </div>
        <div className="text-muted-foreground">
          Total Beds: {rooms.reduce((acc, r) => acc + r.capacity, 0)} • 
          Occupied: {rooms.reduce((acc, r) => acc + r.occupants.length, 0)}
        </div>
      </div>
    </div>
  );
}
