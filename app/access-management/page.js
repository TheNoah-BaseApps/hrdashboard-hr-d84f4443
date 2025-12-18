'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AccessManagementTable from '@/components/access-management/AccessManagementTable';
import FilterBar from '@/components/shared/FilterBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, AlertCircle } from 'lucide-react';

export default function AccessManagementPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/access-management');
      
      if (!response.ok) {
        throw new Error('Failed to fetch access management records');
      }

      const data = await response.json();
      setRecords(data.data || []);
      setFilteredRecords(data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load access management records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...records];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(record => 
        record.employee_name?.toLowerCase().includes(searchLower) ||
        record.employee_id?.toLowerCase().includes(searchLower) ||
        record.department?.toLowerCase().includes(searchLower) ||
        record.system_access?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(record => record.department === filters.department);
    }

    setFilteredRecords(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/access-management/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      await fetchRecords();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete record');
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
          <h1 className="text-3xl font-bold">Access Management</h1>
          <Button onClick={() => router.push('/access-management/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Access Grant
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
            { key: 'search', label: 'Search', type: 'text', placeholder: 'Search by name, ID, department...' },
            { 
              key: 'status', 
              label: 'Status', 
              type: 'select', 
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Expired', label: 'Expired' },
                { value: 'Revoked', label: 'Revoked' },
                { value: 'Pending', label: 'Pending' }
              ]
            }
          ]}
        />

        <AccessManagementTable
          records={filteredRecords}
          onDelete={handleDelete}
          onRefresh={fetchRecords}
        />
      </div>
    </DashboardLayout>
  );
}