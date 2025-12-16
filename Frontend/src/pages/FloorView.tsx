import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { hostelLayouts } from '@/layouts';
import { useFloorState } from '@/hooks/useFloorData';
import { mergeLayoutWithState } from '@/utils/mergeLayoutWithState';
import { FloorMap } from '@/components/hostel/FloorMap';
import { FloorSelector } from '@/components/hostel/FloorSelector';

export default function FloorView() {
  const { hostelId, floor } = useParams();
  const navigate = useNavigate();

  if (!hostelId) {
    return <div>Invalid hostel</div>;
  }

  const selectedFloor = Number(floor ?? 0);

  const hostel = hostelLayouts[hostelId];
  if (!hostel) {
    return <div>Unknown hostel</div>;
  }

  const floors = Object.keys(hostel)
    .map(Number)
    .sort((a, b) => a - b);

  const layout = hostel[selectedFloor];
  if (!layout) {
    return <div>No layout for floor {selectedFloor}</div>;
  }

  const { data: state, error } = useFloorState(hostelId, selectedFloor);

  const nodes = useMemo(
    () => mergeLayoutWithState(layout, state ?? []),
    [layout, state]
  );

  return (
    <div className="space-y-4">
      {/* ✅ Floor selector at top */}
      <FloorSelector
        floors={floors}
        selectedFloor={selectedFloor}
        onSelectFloor={(f) =>
          navigate(`/hostels/${hostelId}/floor/${f}`)
        }
      />

      {error && (
        <p className="text-sm text-muted-foreground">
          Backend unavailable. Showing layout only.
        </p>
      )}

      {/* ✅ Pure renderer */}
      <FloorMap
        width={layout.frame.width}
        height={layout.frame.height}
        nodes={nodes}
      />
    </div>
  );
}
