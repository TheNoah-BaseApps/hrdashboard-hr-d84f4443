'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LeavesAttendanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchRecord();
    }
  }, [params.id]);

  async function fetchRecord() {
    try {
      const response = await fetch(`/api/leaves-attendance/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setRecord(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching record:', err);
      setError('Failed to load record');
    } finally {
      setLoading(false);
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

  if (error || !record) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error || 'Record not found'}</p>
            <Link href="/leaves-attendance">
              <Button className="mt-4">Back to Leaves & Attendance</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <Link href="/leaves-attendance">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leaves & Attendance
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{record.assigned_to}</CardTitle>
              <CardDescription>{record.type}</CardDescription>
            </div>
            <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Request Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{record.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{record.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
                </div>
              </div>
            </div>
          </div>

          {record.comment && (
            <div>
              <h3 className="font-semibold mb-2">Comment</h3>
              <p className="text-sm text-muted-foreground">{record.comment}</p>
            </div>
          )}

          <div className="border-t pt-6 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Created: {new Date(record.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(record.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}