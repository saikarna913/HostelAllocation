import { Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  hostelName?: string;
}

export function Header({ hostelName }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query && query.length > 1) {
        try {
          const token = localStorage.getItem('hostel_access_token');
          const headers: any = {};
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const res = await fetch(`/api/students?q=${encodeURIComponent(query)}`, { headers });
          if (res.ok) {
            const data = await res.json();
            setResults(data || []);
          }
        } catch (e) {
          console.error('Search failed', e);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {hostelName && (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">{hostelName}</h1>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
        )}
        {!hostelName && (
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        )}
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search rooms, students..."
              className="pl-10 bg-secondary border-0 focus-visible:ring-1"
            />
            {results.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-card shadow rounded-md z-20">
                {results.slice(0, 5).map((r) => (
                  <button
                    key={r.id}
                    className="w-full text-left px-3 py-2 hover:bg-accent"
                    onClick={() => navigate(`/students/${r.student_id}`)}
                  >
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.student_id} — {r.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-room-reserved rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { logout(); navigate('/auth'); }}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
