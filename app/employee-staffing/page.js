'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StaffingTable from '@/components/employee-staffing/StaffingTable';
import FilterBar from '@/components/shared/FilterBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, AlertCircle } from 'lucide-react';

export default function EmployeeStaffingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/employee-staffing');
      
      if (!response.ok) {
        throw new Error('Failed to fetch staffing plans');
      }

      const data = await response.json();
      setPlans(data.data || []);
      setFilteredPlans(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load staffing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...plans];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.assigned_to?.toLowerCase().includes(searchLower) ||
        plan.comments?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(plan => plan.status === filters.status);
    }

    if (filters.funded !== undefined && filters.funded !== 'all') {
      const fundedValue = filters.funded === 'true';
      filtered = filtered.filter(plan => plan.funded === fundedValue);
    }

    setFilteredPlans(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/employee-staffing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staffing plan');
      }

      await fetchPlans();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete staffing plan');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Staffing</h1>
          <Button onClick={() => router.push('/employee-staffing/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Staffing Plan
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FilterBar
          onFilter={handleFilter}
          filters={[
            { key: 'search', label: 'Search', type: 'text', placeholder: 'Search by assignee, comments...' },
            { 
              key: 'status', 
              label: 'Status', 
              type: 'select', 
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Planning', label: 'Planning' },
                { value: 'Active', label: 'Active' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]
            },
            { 
              key: 'funded', 
              label: 'Funding', 
              type: 'select', 
              options: [
                { value: 'all', label: 'All' },
                { value: 'true', label: 'Funded' },
                { value: 'false', label: 'Not Funded' }
              ]
            }
          ]}
        />

        <StaffingTable
          plans={filteredPlans}
          onDelete={handleDelete}
          onRefresh={fetchPlans}
        />
      </div>
    </DashboardLayout>
  );
}