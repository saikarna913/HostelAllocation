// utils/mergeLayoutWithState.ts
import { AbsoluteFloorLayout } from '@/types/layout';
import { RoomState, Room } from '@/types/hostel';

export interface RenderNode {
  layout: AbsoluteFloorLayout['nodes'][0];
  room?: Room;
}

export function mergeLayoutWithState(
  layout: AbsoluteFloorLayout,
  state: RoomState[]
): RenderNode[] {
  const map = new Map(state.map(s => [s.roomId, s]));

  return layout.nodes.map(node => {
    if (node.type !== 'room') {
      return { layout: node };
    }

    const s = map.get(node.id);

    return {
      layout: node,
      room: {
        id: node.id,
        label: node.id,
        capacity: 2, // default, can be overridden later
        status: s?.status ?? 'vacant',
        occupants: s?.occupants ?? [],
      },
    };
  });
}
