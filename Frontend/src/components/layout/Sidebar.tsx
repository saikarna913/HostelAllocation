import { Home, Users, Building2, Settings, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HostelMeta } from "@/types/hostel";

interface SidebarProps {
  hostels: HostelMeta[];
}

export function Sidebar({ hostels }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Students", path: "/students" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        size="icon"
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 h-screen border-r bg-card fixed md:static transform transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <span className="font-semibold">HostelMS</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Hostels Section */}
        <div className="mt-6 p-3 border-t">
          <h4 className="text-xs uppercase text-muted-foreground mb-2 px-3">
            Hostels
          </h4>
          <div className="space-y-1">
            {hostels.map((hostel) => (
              <button
                key={hostel.id}
                onClick={() => {
                  navigate(`/hostels/${hostel.id}`);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                  location.pathname === `/hostels/${hostel.id}`
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Building2 className="h-4 w-4" />
                <span>{hostel.name}</span>
                {hostel.type && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {hostel.type}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Settings at bottom */}
        <div className="mt-auto p-3 border-t">
          <button
            onClick={() => {
              navigate("/settings");
              setMobileOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
              location.pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}