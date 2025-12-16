import { RoomState } from '@/types/hostel';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export async function fetchFloorState(
  hostelId: string,
  floor: number
): Promise<RoomState[]> {
  const res = await fetch(
    `${BACKEND_URL}/api/hostels/${hostelId}/floors/${floor}`,
    { credentials: 'include' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch floor data');
  }

  return res.json();
}
