import { Hostel, Room, Floor, Occupant, RoomStatus } from '@/types/hostel';

// Generate hostels A through L
export const hostels: Hostel[] = Array.from({ length: 12 }, (_, i) => {
  const code = String.fromCharCode(65 + i); // A, B, C, ... L
  const floorCount = Math.floor(Math.random() * 3) + 3; // 3-5 floors
  return {
    id: `hostel-${code.toLowerCase()}`,
    name: `Hostel ${code}`,
    code,
    floors: Array.from({ length: floorCount }, (_, j) => j + 1),
    totalCapacity: floorCount * 24 * 2, // 24 rooms per floor, 2 per room
    currentOccupancy: Math.floor(Math.random() * floorCount * 24 * 2 * 0.8),
    type: i < 6 ? 'boys' : 'girls',
  };
});

// Sample occupant names for mock data
const sampleNames = [
  'Aarav Sharma', 'Priya Patel', 'Vikram Singh', 'Ananya Gupta',
  'Rohan Kumar', 'Ishita Verma', 'Arjun Reddy', 'Kavya Nair',
  'Aditya Joshi', 'Sneha Kapoor', 'Rahul Mehta', 'Pooja Iyer',
  'Karthik Rao', 'Divya Menon', 'Sanjay Pillai', 'Neha Agarwal',
  'Amit Saxena', 'Shreya Das', 'Vivek Choudhary', 'Meera Krishnan'
];

const courses = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Sc Physics', 'B.Sc Chemistry', 'MBA', 'M.Tech'];

function generateOccupant(index: number): Occupant {
  return {
    studentId: `STU${String(Math.floor(Math.random() * 90000) + 10000)}`,
    name: sampleNames[index % sampleNames.length],
    course: courses[Math.floor(Math.random() * courses.length)],
    year: Math.floor(Math.random() * 4) + 1,
    checkinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  };
}

// E-shaped floor layout definition
// The E-shape has:
// - Top horizontal bar (row 0): rooms on positions 0-7
// - Middle horizontal bar (row 2): rooms on positions 0-7
// - Bottom horizontal bar (row 4): rooms on positions 0-7
// - Vertical spine (col 0): connects all rows
// - Corridors fill the remaining space

export interface EShapeLayout {
  rows: number;
  cols: number;
  roomPositions: { row: number; col: number; label: string }[];
}

export function generateEShapeLayout(floor: number): EShapeLayout {
  const roomPositions: { row: number; col: number; label: string }[] = [];
  let roomNumber = 1;

  // Top bar (row 0) - 8 rooms
  for (let col = 0; col < 8; col++) {
    roomPositions.push({
      row: 0,
      col,
      label: `${floor}${String(roomNumber++).padStart(2, '0')}`,
    });
  }

  // Middle bar (row 2) - 8 rooms
  for (let col = 0; col < 8; col++) {
    roomPositions.push({
      row: 2,
      col,
      label: `${floor}${String(roomNumber++).padStart(2, '0')}`,
    });
  }

  // Bottom bar (row 4) - 8 rooms
  for (let col = 0; col < 8; col++) {
    roomPositions.push({
      row: 4,
      col,
      label: `${floor}${String(roomNumber++).padStart(2, '0')}`,
    });
  }

  return {
    rows: 5,
    cols: 8,
    roomPositions,
  };
}

export function generateRoomsForFloor(hostelId: string, floor: number): Room[] {
  const layout = generateEShapeLayout(floor);
  const hostelCode = hostelId.split('-')[1].toUpperCase();

  return layout.roomPositions.map((pos, index) => {
    const randomStatus = Math.random();
    let status: RoomStatus;
    let occupants: Occupant[] = [];

    if (randomStatus < 0.65) {
      status = 'occupied';
      const numOccupants = Math.random() > 0.3 ? 2 : 1;
      occupants = Array.from({ length: numOccupants }, (_, i) => 
        generateOccupant(index * 2 + i)
      );
    } else if (randomStatus < 0.85) {
      status = 'vacant';
    } else {
      status = 'reserved';
    }

    return {
      id: `${hostelCode}-${floor}-${pos.label}`,
      hostelId,
      floor,
      label: pos.label,
      capacity: 2,
      occupants,
      status,
      position: {
        row: pos.row,
        col: pos.col,
      },
    };
  });
}

export function generateFloorsForHostel(hostel: Hostel): Floor[] {
  return hostel.floors.map((floorNum) => {
    const rooms = generateRoomsForFloor(hostel.id, floorNum);
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    
    return {
      id: `${hostel.id}-floor-${floorNum}`,
      hostelId: hostel.id,
      floorNumber: floorNum,
      totalRooms: rooms.length,
      occupiedRooms,
    };
  });
}

export function getHostelStats(hostelId: string, floor?: number): {
  totalRooms: number;
  occupied: number;
  vacant: number;
  reserved: number;
} {
  const hostel = hostels.find(h => h.id === hostelId);
  if (!hostel) return { totalRooms: 0, occupied: 0, vacant: 0, reserved: 0 };

  const floors = floor ? [floor] : hostel.floors;
  let totalRooms = 0, occupied = 0, vacant = 0, reserved = 0;

  floors.forEach(f => {
    const rooms = generateRoomsForFloor(hostelId, f);
    totalRooms += rooms.length;
    occupied += rooms.filter(r => r.status === 'occupied').length;
    vacant += rooms.filter(r => r.status === 'vacant').length;
    reserved += rooms.filter(r => r.status === 'reserved').length;
  });

  return { totalRooms, occupied, vacant, reserved };
}
