import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('hostel_access_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch('/api/students', { headers })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((s) => (
          <div key={s.id} className="p-3 border rounded-md hover:shadow cursor-pointer" onClick={() => navigate(`/students/${s.student_id}`)}>
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.student_id} — {s.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
