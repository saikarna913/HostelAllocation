// useFloorData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFloorState } from '@/api/floorState';
import { RoomState } from '@/types/hostel';

export function useFloorState(hostelId: string, floor: number) {
  return useQuery<RoomState[]>({
    queryKey: ['floor-state', hostelId, floor],
    queryFn: () => fetchFloorState(hostelId, floor),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
