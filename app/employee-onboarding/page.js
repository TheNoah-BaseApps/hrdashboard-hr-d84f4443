'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OnboardingTable from '@/components/employee-onboarding/OnboardingTable';
import FilterBar from '@/components/shared/FilterBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, AlertCircle } from 'lucide-react';

export default function EmployeeOnboardingPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/employee-onboarding');
      
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding tasks');
      }

      const data = await response.json();
      setTasks(data.data || []);
      setFilteredTasks(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load onboarding tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...tasks];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.task?.toLowerCase().includes(searchLower) ||
        task.name_of_employee?.toLowerCase().includes(searchLower) ||
        task.assigned_to?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(task => task.type === filters.type);
    }

    setFilteredTasks(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/employee-onboarding/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete task');
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
          <h1 className="text-3xl font-bold">Employee Onboarding</h1>
          <Button onClick={() => router.push('/employee-onboarding/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Onboarding Task
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
            { key: 'search', label: 'Search', type: 'text', placeholder: 'Search by task, employee, assignee...' },
            { 
              key: 'status', 
              label: 'Status', 
              type: 'select', 
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Overdue', label: 'Overdue' }
              ]
            },
            { 
              key: 'type', 
              label: 'Type', 
              type: 'select', 
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'Documentation', label: 'Documentation' },
                { value: 'Training', label: 'Training' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'System Setup', label: 'System Setup' },
                { value: 'Orientation', label: 'Orientation' }
              ]
            }
          ]}
        />

        <OnboardingTable
          tasks={filteredTasks}
          onDelete={handleDelete}
          onRefresh={fetchTasks}
        />
      </div>
    </DashboardLayout>
  );
}