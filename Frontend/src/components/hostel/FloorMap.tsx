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
      {nodes.map((node) => {
        const { layout } = node;

        const key = `${layout.id}-${layout.x}-${layout.y}`;

        const isRotated = Math.abs(layout.rotation ?? 0) === 90;
        const isTall = layout.height > layout.width;

        // 🧠 text orientation logic
        const textRotation =
          isRotated && isTall ? 'rotate(90deg)' : 'rotate(0deg)';

        const containerStyle: React.CSSProperties = {
          position: 'absolute',
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
          transform: layout.rotation
            ? `rotate(${layout.rotation}deg)`
            : undefined,
          transformOrigin: 'top left',
        };

        // ---- ROOM ----
        if (layout.type === 'room' && node.room) {
          return (
            <div key={key} style={containerStyle}>
              <RoomCell
                room={node.room}
                onClick={() => onRoomClick?.(node.room!.id)}
              />
            </div>
          );
        }

        // ---- PANTRY / LABEL / CORRIDOR ----
        return (
          <div
            key={key}
            style={containerStyle}
            className="absolute flex items-center justify-center rounded bg-muted text-xs font-medium overflow-hidden"
          >
            <span
              style={{
                transform: textRotation,
                whiteSpace: 'nowrap',
              }}
            >
              {layout.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
