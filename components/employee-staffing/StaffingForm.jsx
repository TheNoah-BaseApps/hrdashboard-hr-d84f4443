'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormInput from '@/components/shared/FormInput';
import { STAFFING_STATUS } from '@/lib/utils/constants';
import { AlertCircle } from 'lucide-react';

export default function StaffingForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    recruiting_source_budget: '',
    hire_goal: '',
    funded: false,
    status: 'Planning',
    assigned_to: '',
    comments: ''
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
        throw new Error(result.error || 'Failed to save staffing plan');
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
        <CardTitle>{initialData ? 'Edit Staffing Plan' : 'Create Staffing Plan'}</CardTitle>
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
              label="Recruiting Source Budget"
              type="number"
              step="0.01"
              value={formData.recruiting_source_budget}
              onChange={(e) => handleChange('recruiting_source_budget', e.target.value)}
              required
            />

            <FormInput
              label="Hire Goal"
              type="number"
              value={formData.hire_goal}
              onChange={(e) => handleChange('hire_goal', e.target.value)}
              required
            />

            <FormInput
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={STAFFING_STATUS}
              required
            />

            <FormInput
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => handleChange('assigned_to', e.target.value)}
              required
            />

            <div className="flex items-center space-x-2 md:col-span-2">
              <input
                type="checkbox"
                id="funded"
                checked={formData.funded}
                onChange={(e) => handleChange('funded', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="funded" className="text-sm font-medium text-gray-700">
                Budget Funded
              </label>
            </div>

            <FormInput
              label="Comments"
              type="textarea"
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              rows={4}
              className="md:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Plan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}