'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataGrid from '@/components/shared/DataGrid';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/lib/utils/formatters';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessManagementTable({ records, onDelete, onRefresh }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    { 
      key: 'employee_name', 
      label: 'Employee Name',
      sortable: true 
    },
    { 
      key: 'employee_id', 
      label: 'Employee ID',
      sortable: true 
    },
    { 
      key: 'department', 
      label: 'Department',
      sortable: true 
    },
    { 
      key: 'access_level', 
      label: 'Access Level',
      sortable: true 
    },
    { 
      key: 'system_access', 
      label: 'System',
      sortable: true 
    },
    { 
      key: 'date_granted', 
      label: 'Date Granted',
      sortable: true,
      render: (value) => formatDate(value)
    },
    { 
      key: 'expiry_date', 
      label: 'Expiry Date',
      sortable: true,
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} type="access" />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/access-management/${record.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/access-management/${record.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(record.id)}
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
        data={records}
        columns={columns}
        emptyMessage="No access management records found"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Access Record"
        description="Are you sure you want to delete this access record? This action cannot be undone."
      />
    </>
  );
}