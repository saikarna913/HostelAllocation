import { FloorWithRooms } from '@/utils/mergeLayoutWithState';
import { Room } from '@/types/hostel';
import { RoomCell } from './RoomCell';

interface Props {
  floor: FloorWithRooms;
  onRoomClick?: (room: Room) => void;
}

export function FloorMap({ floor, onRoomClick }: Props) {
  return (
    <div className="space-y-8">
      {floor.wings.map(wing => (
        <div key={wing.name}>
          <h3 className="font-semibold mb-2">Wing {wing.name}</h3>

          <div className="space-y-2">
            {wing.rows.map(row => (
              <div key={row.index} className="flex gap-2">
                {row.rooms.map(room => (
                  <RoomCell
                    key={room.id}
                    room={room}
                    onClick={() => onRoomClick?.(room)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}