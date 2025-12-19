'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TalentDevelopmentPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      setLoading(true);
      const res = await fetch('/api/talent-development');
      const data = await res.json();
      
      if (data.success) {
        setPrograms(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const res = await fetch(`/api/talent-development/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchPrograms();
      } else {
        alert('Error deleting program: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting program:', err);
      alert('Failed to delete program');
    }
  }

  if (loading) return <div className="container mx-auto p-8"><p>Loading...</p></div>;
  if (error) return <div className="container mx-auto p-8"><Card><CardContent className="p-6"><p className="text-red-600">Error: {error}</p></CardContent></Card></div>;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Talent Development</h1>
        <Link href="/talent-development/new">
          <Button>Add New Program</Button>
        </Link>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No talent development programs found. Add one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Training Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.employee_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.training_program}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.trainer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.progress_percentage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{program.completion_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Link href={`/talent-development/${program.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(program.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}