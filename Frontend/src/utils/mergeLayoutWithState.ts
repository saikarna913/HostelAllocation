import { FloorLayout, Room, RoomState } from '@/types/hostel';

export interface FloorWithRooms extends Omit<FloorLayout, 'wings'> {
  wings: {
    name: string;
    rows: {
      index: number;
      rooms: Room[];
    }[];
  }[];
}

export function mergeLayoutWithState(
  layout: FloorLayout,
  state: RoomState[]
): FloorWithRooms {
  const map = new Map(state.map(s => [s.roomId, s]));

  return {
    ...layout,
    wings: layout.wings.map(w => ({
      ...w,
      rows: w.rows.map(r => ({
        ...r,
        rooms: r.rooms.map(room => {
          const s = map.get(room.id);
          return {
            ...room,
            status: s?.status ?? 'vacant',
            occupants: s?.occupants ?? [],
          };
        }),
      })),
    })),
  };
}
