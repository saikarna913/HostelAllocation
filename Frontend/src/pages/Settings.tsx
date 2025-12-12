import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast as toaster } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const CreateUserForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin'|'staff'>('staff');
    const [isCreating, setIsCreating] = useState(false);

    const createUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsCreating(true);
      try {
        const token = localStorage.getItem('hostel_access_token');
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.detail || 'Unable to create user');
        }
        toaster({ title: 'User created', description: `${email} created successfully.` });
        // clear form
        setName(''); setEmail(''); setPassword(''); setRole('staff');
      } catch (err) {
        console.error(err);
        toaster({ title: 'Failed', description: 'Unable to create user', variant: 'destructive' });
      } finally {
        setIsCreating(false);
      }
    };

    return (
      <form onSubmit={createUser} className="space-y-4 p-4 border rounded-lg bg-card">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'admin'|'staff')} className="w-full rounded-md border p-2">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end">
          <Button className="h-10" type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create user'}</Button>
        </div>
      </form>
    )
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <p className="text-muted-foreground">Application settings and configuration will go here.</p>
      {user?.role === 'admin' ? (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Create user</h3>
          <CreateUserForm />
        </div>
      ) : (
        <div className="mt-6 text-sm text-muted-foreground">Only administrators can create users.</div>
      )}
    </div>
  );
}
