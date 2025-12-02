import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FloorSelector } from '@/components/hostel/FloorSelector';
import { FloorMap } from '@/components/hostel/FloorMap';
import { StatsCards } from '@/components/hostel/StatsCards';
import { RoomDetailsPanel } from '@/components/hostel/RoomDetailsPanel';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { hostels, generateRoomsForFloor, getHostelStats } from '@/data/mockData';
import { Room } from '@/types/hostel';

const Index = () => {
  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const selectedHostel = useMemo(
    () => hostels.find((h) => h.id === selectedHostelId),
    [selectedHostelId]
  );

  // Reset floor when hostel changes
  useEffect(() => {
    if (selectedHostel) {
      setSelectedFloor(selectedHostel.floors[0]);
    }
  }, [selectedHostel]);

  // Generate rooms for current floor
  const currentRooms = useMemo(() => {
    if (!selectedHostelId) return [];
    return generateRoomsForFloor(selectedHostelId, selectedFloor);
  }, [selectedHostelId, selectedFloor]);

  // Get stats for current hostel/floor
  const stats = useMemo(() => {
    if (!selectedHostelId) return { totalRooms: 0, occupied: 0, vacant: 0, reserved: 0 };
    return getHostelStats(selectedHostelId, selectedFloor);
  }, [selectedHostelId, selectedFloor]);

  // Floor stats for the selector
  const floorStats = useMemo(() => {
    if (!selectedHostel) return {};
    const result: Record<number, { occupied: number; total: number }> = {};
    selectedHostel.floors.forEach((floor) => {
      const floorStat = getHostelStats(selectedHostel.id, floor);
      result[floor] = { occupied: floorStat.occupied, total: floorStat.totalRooms };
    });
    return result;
  }, [selectedHostel]);

  const handleSelectHostel = (hostelId: string) => {
    setSelectedHostelId(hostelId);
    setSelectedRoom(null);
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        hostels={hostels}
        selectedHostel={selectedHostelId}
        onSelectHostel={handleSelectHostel}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header hostelName={selectedHostel?.name} />

        <main className="flex-1 overflow-auto p-6">
          {!selectedHostel ? (
            <WelcomeCard onSelectHostel={() => setSelectedHostelId(hostels[0].id)} />
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Stats */}
              <StatsCards stats={stats} />

              {/* Floor Selector */}
              <FloorSelector
                floors={selectedHostel.floors}
                selectedFloor={selectedFloor}
                onSelectFloor={setSelectedFloor}
                floorStats={floorStats}
              />

              {/* Floor Map */}
              <FloorMap
                rooms={currentRooms}
                hostelCode={selectedHostel.code}
                floorNumber={selectedFloor}
                onRoomClick={handleRoomClick}
              />
            </div>
          )}
        </main>
      </div>

      {/* Room Details Panel */}
      {selectedRoom && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSelectedRoom(null)}
          />
          <RoomDetailsPanel
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        </>
      )}
    </div>
  );
};

export default Index;
