import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/api/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  hostelName?: string;
}

export function Header({ hostelName }: HeaderProps) {
  const { logout, user } = useAuth(); // Assuming useAuth returns user info
  const navigate = useNavigate();

  // Minimal function for logout - same as in your simpler code
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {hostelName ? (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{hostelName}</h1>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        )}
      </div>

      {/* Right Section - Minimal buttons as in second code */}
      <div className="flex items-center gap-2">
        {/* Optional: Remove search if not needed */}
        
        {/* Notifications button - same as simpler version */}
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User menu - enhanced but with minimal logout functionality */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block font-medium">
                {user?.name || 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Simple logout button that matches second code's functionality */}
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Alternative: Simple logout button (uncomment to use) */}
        {/* <Button
          variant="ghost"
          className="gap-2"
          onClick={handleLogout}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
          <LogOut className="h-4 w-4" />
        </Button> */}
      </div>
    </header>
  );
}