import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFloorData } from '@/hooks/useFloorData';
import { FloorMap } from '@/components/hostel/FloorMap';
import { RoomDetailsPanel } from '@/components/hostel/RoomDetailsPanel';
import { Room } from '@/types/hostel';

export default function FloorView() {
  const { hostelId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);

  const { data } = useFloorData(hostelId!, 1);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <FloorMap floor={data} onRoomClick={setRoom} />
      {room && <RoomDetailsPanel room={room} onClose={() => setRoom(null)} />}
    </>
  );
}
