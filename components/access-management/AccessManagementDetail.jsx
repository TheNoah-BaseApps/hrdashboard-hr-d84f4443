'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import AccessManagementForm from './AccessManagementForm';
import { formatDate } from '@/lib/utils/formatters';
import { Pencil, Calendar, User, Building2, Shield, Monitor } from 'lucide-react';

export default function AccessManagementDetail({ record, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (formData) => {
    const result = await onUpdate(formData);
    if (result.success) {
      setIsEditing(false);
    }
    return result;
  };

  if (isEditing) {
    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="mb-4"
        >
          Cancel
        </Button>
        <AccessManagementForm
          initialData={record}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsEditing(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Record
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Access Information</CardTitle>
            <StatusBadge status={record.status} type="access" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Employee Name</p>
                <p className="text-base font-semibold">{record.employee_name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p className="text-base">{record.employee_id}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-base">{record.department}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Access Level</p>
                <p className="text-base">{record.access_level}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">System Access</p>
                <p className="text-base">{record.system_access}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Granted By</p>
                <p className="text-base">{record.granted_by}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date Granted</p>
                <p className="text-base">{formatDate(record.date_granted)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                <p className="text-base">{formatDate(record.expiry_date)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-base">{formatDate(record.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base">{formatDate(record.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}