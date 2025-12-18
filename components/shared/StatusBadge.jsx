'use client';

import { cn } from '@/lib/utils';

const statusConfig = {
  access: {
    Active: 'bg-green-100 text-green-800 border-green-200',
    Expired: 'bg-red-100 text-red-800 border-red-200',
    Revoked: 'bg-gray-100 text-gray-800 border-gray-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  onboarding: {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-green-100 text-green-800 border-green-200',
    Overdue: 'bg-red-100 text-red-800 border-red-200'
  },
  staffing: {
    Planning: 'bg-purple-100 text-purple-800 border-purple-200',
    Active: 'bg-green-100 text-green-800 border-green-200',
    'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
    Cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  }
};

export default function StatusBadge({ status, type = 'access' }) {
  const config = statusConfig[type] || statusConfig.access;
  const className = config[status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      className
    )}>
      {status}
    </span>
  );
}