import { RoomState } from '@/types/hostel';

export async function fetchFloorState(
  hostelId: string,
  floor: number
): Promise<RoomState[]> {
  const res = await fetch(
    `/api/hostels/${hostelId}/floors/${floor}`,
    { credentials: 'include' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch floor data');
  }

  return res.json();
}
