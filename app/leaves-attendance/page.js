'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Loader2 } from 'lucide-react';

export default function LeavesAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const response = await fetch('/api/leaves-attendance');
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching leaves/attendance records:', err);
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/leaves-attendance/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setRecords(records.filter(record => record.id !== id));
      } else {
        alert('Failed to delete record');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record');
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Leaves and Attendance
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage employee leave requests and attendance tracking
          </p>
        </div>
        <Link href="/leaves-attendance/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {records.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first leave request
              </p>
              <Link href="/leaves-attendance/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{record.assigned_to}</span>
                  <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
                </CardTitle>
                <CardDescription>{record.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{record.duration}</span>
                  </div>
                  {record.comment && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Comment:</span>
                      <p className="text-sm mt-1">{record.comment}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/leaves-attendance/${record.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}