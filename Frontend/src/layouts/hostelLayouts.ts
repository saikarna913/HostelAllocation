import { HostelLayout, HostelMeta } from '@/types/hostel';

export const hostelLayouts: Record<string, HostelLayout> = {
  KRISHNA: {
    id: 'KRISHNA',
    name: 'Krishna Hostel',
    floors: {
      1: {
        floorNumber: 1,
        wings: [
          {
            name: 'A',
            rows: [
              { index: 0, rooms: [{ id: 'A101', label: 'A101', capacity: 4 }] },
              { index: 1, rooms: [{ id: 'A102', label: 'A102', capacity: 2 }] },
            ],
          },
          {
            name: 'B',
            rows: [
              { index: 0, rooms: [{ id: 'B101', label: 'B101', capacity: 3 }] },
              { index: 1, rooms: [{ id: 'B102', label: 'B102', capacity: 1 }] },
            ],
          },
          {
            name: 'C',
            rows: [
              { index: 0, rooms: [{ id: 'C101', label: 'C101', capacity: 4 }] },
              { index: 1, rooms: [{ id: 'C102', label: 'C102', capacity: 3 }] },
            ],
          },
        ],
      },
    },
  },
};

export const hostels: HostelMeta[] = Object.values(hostelLayouts).map(
  ({ id, name }) => ({
    id,
    name,
    type: 'boys',
  })
);
