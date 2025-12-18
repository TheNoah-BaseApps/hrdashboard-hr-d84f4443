'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormInput from '@/components/shared/FormInput';
import DatePicker from '@/components/shared/DatePicker';
import { TASK_TYPES, TASK_STATUS } from '@/lib/utils/constants';
import { AlertCircle } from 'lucide-react';

export default function OnboardingForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    task: '',
    type: 'Documentation',
    document_name: '',
    assigned_to: '',
    name_of_employee: '',
    due_date: '',
    status: 'Pending',
    completed_date: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to save task');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Onboarding Task' : 'Create Onboarding Task'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Task Description"
              value={formData.task}
              onChange={(e) => handleChange('task', e.target.value)}
              required
              className="md:col-span-2"
            />

            <FormInput
              label="Task Type"
              type="select"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={TASK_TYPES}
              required
            />

            <FormInput
              label="Document Name"
              value={formData.document_name}
              onChange={(e) => handleChange('document_name', e.target.value)}
            />

            <FormInput
              label="Employee Name"
              value={formData.name_of_employee}
              onChange={(e) => handleChange('name_of_employee', e.target.value)}
              required
            />

            <FormInput
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
              required
            />

            <DatePicker
              label="Due Date"
              value={formData.due_date}
              onChange={(value) => handleChange('due_date', value)}
              required
            />

            <FormInput
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={TASK_STATUS}
              required
            />

            {formData.status === 'Completed' && (
              <DatePicker
                label="Completed Date"
                value={formData.completed_date}
                onChange={(value) => handleChange('completed_date', value)}
              />
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}