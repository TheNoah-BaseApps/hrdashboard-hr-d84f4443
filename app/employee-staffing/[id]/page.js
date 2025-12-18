'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StaffingDetail from '@/components/employee-staffing/StaffingDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function StaffingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchPlan();
    }
  }, [params.id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/employee-staffing/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch staffing plan');
      }

      const data = await response.json();
      setPlan(data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load staffing plan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/employee-staffing/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      await fetchPlan();
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
          Back to Staffing
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Staffing Plan Details</h1>

        <StaffingDetail
          plan={plan}
          onUpdate={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
}