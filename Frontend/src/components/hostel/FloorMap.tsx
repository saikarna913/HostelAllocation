import { RenderNode } from '@/utils/mergeLayoutWithState';
import { RoomCell } from './RoomCell';

interface Props {
  width: number;
  height: number;
  nodes: RenderNode[];
  onRoomClick?: (roomId: string) => void;
}

export function FloorMap({ width, height, nodes, onRoomClick }: Props) {
  return (
    <div
      className="relative border bg-background"
      style={{ width, height }}
    >
      {nodes.map(node => {
        const { layout } = node;

        // ---- ROOM ----
        if (layout.type === 'room' && node.room) {
          return (
            <div
              key={layout.id}
              style={{
                position: 'absolute',
                left: layout.x,
                top: layout.y,
                width: layout.width,
                height: layout.height,
              }}
            >
              <RoomCell
                room={node.room}
                onClick={() => onRoomClick?.(node.room!.id)}
              />
            </div>
          );
        }

        // ---- PANTRY / LABEL ----
        return (
          <div
            key={layout.id}
            className="absolute flex items-center justify-center rounded bg-muted text-xs font-medium"
            style={{
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
            }}
          >
            {layout.label}
          </div>
        );
      })}
    </div>
  );
}
