export interface HostelMeta {
  id: string;
  name: string;
  type: 'boys' | 'girls';
}

export interface RoomLayout {
  id: string;
  label: string;
  capacity: 1 | 2 | 3 | 4;
}

export interface RowLayout {
  index: number;
  rooms: RoomLayout[];
}

export interface WingLayout {
  name: string;
  rows: RowLayout[];
}

export interface FloorLayout {
  floorNumber: number;
  wings: WingLayout[];
}

export interface HostelLayout {
  id: string;
  name: string;
  floors: Record<number, FloorLayout>;
}

export type RoomStatus = 'vacant' | 'occupied' | 'reserved';

export interface Occupant {
  studentId: string;
  name: string;
  branch: string;
  year: number;
}

export interface Room extends RoomLayout {
  status: RoomStatus;
  occupants: Occupant[];
}

export interface RoomState {
  roomId: string;
  status: RoomStatus;
  occupants: Occupant[];
}
