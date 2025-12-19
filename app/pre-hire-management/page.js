'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PreHireManagementPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, [statusFilter]);

  async function fetchCandidates() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('interview_status', statusFilter);
      
      const res = await fetch(`/api/pre-hire-management?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setCandidates(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    
    try {
      const res = await fetch(`/api/pre-hire-management/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchCandidates();
      } else {
        alert('Error deleting candidate: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting candidate:', err);
      alert('Failed to delete candidate');
    }
  }

  if (loading) return <div className="container mx-auto p-8"><p>Loading...</p></div>;
  if (error) return <div className="container mx-auto p-8"><Card><CardContent className="p-6"><p className="text-red-600">Error: {error}</p></CardContent></Card></div>;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pre Hire Management</h1>
        <Link href="/pre-hire-management/new">
          <Button>Add New Candidate</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="statusFilter">Interview Status</Label>
              <Input
                id="statusFilter"
                type="text"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No candidates found. Add one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pre Hire ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Background Check</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.pre_hire_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.candidate_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.position_applied_for}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.interview_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{candidate.background_check_status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Link href={`/pre-hire-management/${candidate.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(candidate.id)}>Delete</Button>
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