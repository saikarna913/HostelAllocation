export type RoomStatus = 'vacant' | 'occupied' | 'reserved';

export interface Occupant {
  studentId: string;
  name: string;
  course?: string;
  year?: number;
  checkinDate?: string;
}

export interface Room {
  id: string;
  hostelId: string;
  floor: number;
  label: string;
  capacity: number;
  occupants: Occupant[];
  status: RoomStatus;
  position: {
    row: number;
    col: number;
  };
}

export interface Floor {
  id: string;
  hostelId: string;
  floorNumber: number;
  totalRooms: number;
  occupiedRooms: number;
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  floors: number[];
  totalCapacity: number;
  currentOccupancy: number;
  type: 'boys' | 'girls' | 'mixed';
}

export interface HostelStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  reservedRooms: number;
  occupancyRate: number;
}
