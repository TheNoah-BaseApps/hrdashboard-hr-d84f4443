'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OnboardingDetail from '@/components/employee-onboarding/OnboardingDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/employee-onboarding/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding task');
      }

      const data = await response.json();
      setTask(data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load onboarding task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/employee-onboarding/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTask();
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
          Back to Onboarding
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Onboarding Task Details</h1>

        <OnboardingDetail
          task={task}
          onUpdate={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
}