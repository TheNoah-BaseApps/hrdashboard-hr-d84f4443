'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid from '@/components/shared/DataGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/lib/utils/formatters';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OnboardingTable({ tasks, onDelete, onRefresh }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    { 
      key: 'task', 
      label: 'Task',
      sortable: true 
    },
    { 
      key: 'type', 
      label: 'Type',
      sortable: true 
    },
    { 
      key: 'name_of_employee', 
      label: 'Employee',
      sortable: true 
    },
    { 
      key: 'assigned_to', 
      label: 'Assigned To',
      sortable: true 
    },
    { 
      key: 'due_date', 
      label: 'Due Date',
      sortable: true,
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} type="onboarding" />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, task) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/employee-onboarding/${task.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/employee-onboarding/${task.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(task.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
      onRefresh();
    }
  };

  return (
    <>
      <DataGrid
        data={tasks}
        columns={columns}
        emptyMessage="No onboarding tasks found"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Onboarding Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
}