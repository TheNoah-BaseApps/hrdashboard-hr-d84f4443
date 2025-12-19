'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecruitmentATSPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    try {
      setLoading(true);
      const res = await fetch('/api/recruitment-ats');
      const data = await res.json();
      
      if (data.success) {
        setApplicants(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this applicant?')) return;
    
    try {
      const res = await fetch(`/api/recruitment-ats/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchApplicants();
      } else {
        alert('Error deleting applicant: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting applicant:', err);
      alert('Failed to delete applicant');
    }
  }

  if (loading) return <div className="container mx-auto p-8"><p>Loading...</p></div>;
  if (error) return <div className="container mx-auto p-8"><Card><CardContent className="p-6"><p className="text-red-600">Error: {error}</p></CardContent></Card></div>;

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recruitment / ATS</h1>
        <Link href="/recruitment-ats/new">
          <Button>Add New Applicant</Button>
        </Link>
      </div>

      {applicants.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No applicants found. Add one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{applicant.applicant_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{applicant.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{applicant.position_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(applicant.date_applied).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{applicant.experience || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Link href={`/recruitment-ats/${applicant.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(applicant.id)}>Delete</Button>
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