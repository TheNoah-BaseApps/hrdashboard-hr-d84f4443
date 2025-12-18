'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid from '@/components/shared/DataGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/utils/formatters';
import { Eye, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StaffingTable({ plans, onDelete, onRefresh }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    { 
      key: 'recruiting_source_budget', 
      label: 'Budget',
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'hire_goal', 
      label: 'Hire Goal',
      sortable: true 
    },
    { 
      key: 'funded', 
      label: 'Funded',
      sortable: true,
      render: (value) => value ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-red-600" />
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} type="staffing" />
    },
    { 
      key: 'assigned_to', 
      label: 'Assigned To',
      sortable: true 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, plan) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/employee-staffing/${plan.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/employee-staffing/${plan.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(plan.id)}
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
        data={plans}
        columns={columns}
        emptyMessage="No staffing plans found"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staffing Plan"
        description="Are you sure you want to delete this staffing plan? This action cannot be undone."
      />
    </>
  );
}