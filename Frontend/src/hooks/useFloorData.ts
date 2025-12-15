import { useQuery } from '@tanstack/react-query';
import { hostelLayouts } from '@/layouts/hostelLayouts';
import { fetchFloorState } from '@/api/floorState';
import { mergeLayoutWithState } from '@/utils/mergeLayoutWithState';

export function useFloorData(hostelId: string, floor: number) {
  const layout = hostelLayouts[hostelId]?.floors[floor];

  return useQuery({
    queryKey: ['floor', hostelId, floor],
    queryFn: async () => {
      const state = await fetchFloorState(hostelId, floor);
      return mergeLayoutWithState(layout, state);
    },
    enabled: !!layout,
  });
}
