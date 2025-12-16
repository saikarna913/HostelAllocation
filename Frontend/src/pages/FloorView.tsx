import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { hostelLayouts } from '@/layouts';
import { useFloorState } from '@/hooks/useFloorData';
import { mergeLayoutWithState } from '@/utils/mergeLayoutWithState';
import { FloorMap } from '@/components/hostel/FloorMap';

export default function FloorView() {
  const { hostelId, floor } = useParams();

  if (!hostelId) {
    return <div>Invalid hostel</div>;
  }

  const floorNumber = Number(floor ?? 0);
console.log({
  hostelId,
  floor,
  floorNumber,
  availableHostels: Object.keys(hostelLayouts),
  availableFloors: hostelLayouts[hostelId],
});
  const layout =
    hostelLayouts[hostelId]?.[floorNumber];

  if (!layout) {
    return <div>No layout for this floor</div>;
  }

  const { data: state } = useFloorState(hostelId, floorNumber);

  const nodes = useMemo(
    () => mergeLayoutWithState(layout, state ?? []),
    [layout, state]
  );

  return (
    <FloorMap
      width={layout.frame.width}
      height={layout.frame.height}
      nodes={nodes}
    />
  );
}
