'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AccessManagementDetail from '@/components/access-management/AccessManagementDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function AccessManagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchRecord();
    }
  }, [params.id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/access-management/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch access record');
      }

      const data = await response.json();
      setRecord(data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load access record');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/access-management/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      await fetchRecord();
      return { success: true };
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, error: err.message };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Access Management
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Access Record Details</h1>

        <AccessManagementDetail
          record={record}
          onUpdate={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
}