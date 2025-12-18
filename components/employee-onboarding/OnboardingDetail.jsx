'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import OnboardingForm from './OnboardingForm';
import DocumentUploader from './DocumentUploader';
import { formatDate } from '@/lib/utils/formatters';
import { Pencil, Calendar, User, FileText, ClipboardList } from 'lucide-react';

export default function OnboardingDetail({ task, onUpdate }) {
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
        <OnboardingForm
          initialData={task}
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
          Edit Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Information</CardTitle>
            <StatusBadge status={task.status} type="onboarding" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3 md:col-span-2">
              <ClipboardList className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Task Description</p>
                <p className="text-base font-semibold">{task.task}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Task Type</p>
                <p className="text-base">{task.type}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Document Name</p>
                <p className="text-base">{task.document_name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Employee Name</p>
                <p className="text-base">{task.name_of_employee}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <p className="text-base">{task.assigned_to}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <p className="text-base">{formatDate(task.due_date)}</p>
              </div>
            </div>

            {task.completed_date && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Date</p>
                  <p className="text-base">{formatDate(task.completed_date)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {task.type === 'Documentation' && (
        <DocumentUploader taskId={task.id} documentName={task.document_name} />
      )}

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
                <p className="text-base">{formatDate(task.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base">{formatDate(task.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}