import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token = localStorage.getItem('hostel_access_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/students/${id}`, { headers })
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!student) return <div className="p-6">Student not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{student.name}</h2>
      <p className="text-muted-foreground">{student.student_id} — {student.email}</p>
      <div className="mt-4">
        <p><strong>Program:</strong> {student.program_id}</p>
        <p><strong>Year:</strong> {student.year}</p>
        <p><strong>Hostel:</strong> {student.hostel_id}</p>
        <p><strong>Room:</strong> {student.room_id}</p>
      </div>
    </div>
  );
}
