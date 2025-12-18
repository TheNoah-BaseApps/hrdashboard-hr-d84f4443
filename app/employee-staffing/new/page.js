'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StaffingForm from '@/components/employee-staffing/StaffingForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewStaffingPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/employee-staffing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create staffing plan');
      }

      const result = await response.json();
      router.push(`/employee-staffing/${result.data.id}`);
      return { success: true };
    } catch (err) {
      console.error('Create error:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staffing
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">New Staffing Plan</h1>

        <StaffingForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}