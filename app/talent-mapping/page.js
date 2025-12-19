'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TalentMappingPage() {
  const [talentMapping, setTalentMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchTalentMapping();
  }, [departmentFilter]);

  async function fetchTalentMapping() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (departmentFilter) params.append('department', departmentFilter);
      
      const res = await fetch(`/api/talent-mapping?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setTalentMapping(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching talent mapping:', err);
      setError('Failed to load talent mapping');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const res = await fetch(`/api/talent-mapping/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchTalentMapping();
      } else {
        alert('Error deleting entry: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Talent Mapping</h1>
        <Link href="/talent-mapping/new">
          <Button>Create New Entry</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="departmentFilter">Department</Label>
              <Input
                id="departmentFilter"
                type="text"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                placeholder="Filter by department"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {talentMapping.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No talent mapping entries found. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potential</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Box</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {talentMapping.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.employee_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.name_surname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.performance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.potential}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.box_categorization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Link href={`/talent-mapping/${entry.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
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