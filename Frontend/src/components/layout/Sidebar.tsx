import { Building2, ChevronLeft, ChevronRight, Home, Settings, Users, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Hostel } from '@/types/hostel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  hostels: Hostel[];
  selectedHostel: string | null;
  onSelectHostel: (hostelId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  hostels,
  selectedHostel,
  onSelectHostel,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const navigate = useNavigate();
  const NavItem = ({
    icon: Icon,
    label,
    active,
    onClick,
    badge,
  }: {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
    badge?: string;
  }) => {
    const content = (
      <button
        onClick={onClick}
        className={cn(
          'sidebar-item w-full',
          active && 'sidebar-item-active'
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{label}</span>
            {badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-foreground/70">
                {badge}
              </span>
            )}
          </>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {badge && <span className="text-muted-foreground">({badge})</span>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-lg">HostelMS</span>
          </div>
        )}
        {collapsed && <Building2 className="h-6 w-6 text-sidebar-primary mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-1">
          <NavItem icon={Home} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={BarChart3} label="Analytics" />
          <NavItem icon={Users} label="Students" onClick={() => navigate('/students')} />
        </div>

        {/* Hostels Section */}
        <div className="mt-6 px-3">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2 px-3">
              Hostels
            </h3>
          )}
          <div className="space-y-1">
            {hostels.map((hostel) => (
              <NavItem
                key={hostel.id}
                icon={Building2}
                label={hostel.name}
                active={selectedHostel === hostel.id}
                onClick={() => onSelectHostel(hostel.id)}
                badge={hostel.type === 'boys' ? 'B' : 'G'}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <NavItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
      </div>
    </aside>
  );
}
