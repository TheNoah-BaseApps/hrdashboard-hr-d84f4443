'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormInput from '@/components/shared/FormInput';
import DatePicker from '@/components/shared/DatePicker';
import { ACCESS_LEVELS, ACCESS_STATUS } from '@/lib/utils/constants';
import { AlertCircle } from 'lucide-react';

export default function AccessManagementForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {
    employee_name: '',
    employee_id: '',
    department: '',
    access_level: 'Basic',
    system_access: '',
    granted_by: '',
    date_granted: new Date().toISOString().split('T')[0],
    expiry_date: '',
    status: 'Pending'
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
        throw new Error(result.error || 'Failed to save record');
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
        <CardTitle>{initialData ? 'Edit Access Record' : 'Create Access Record'}</CardTitle>
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
              label="Employee Name"
              value={formData.employee_name}
              onChange={(e) => handleChange('employee_name', e.target.value)}
              required
            />

            <FormInput
              label="Employee ID"
              value={formData.employee_id}
              onChange={(e) => handleChange('employee_id', e.target.value)}
              required
            />

            <FormInput
              label="Department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              required
            />

            <FormInput
              label="Access Level"
              type="select"
              value={formData.access_level}
              onChange={(e) => handleChange('access_level', e.target.value)}
              options={ACCESS_LEVELS}
              required
            />

            <FormInput
              label="System Access"
              value={formData.system_access}
              onChange={(e) => handleChange('system_access', e.target.value)}
              placeholder="e.g., Workday, SAP, Oracle"
              required
            />

            <FormInput
              label="Granted By"
              value={formData.granted_by}
              onChange={(e) => handleChange('granted_by', e.target.value)}
              required
            />

            <DatePicker
              label="Date Granted"
              value={formData.date_granted}
              onChange={(value) => handleChange('date_granted', value)}
              required
            />

            <DatePicker
              label="Expiry Date"
              value={formData.expiry_date}
              onChange={(value) => handleChange('expiry_date', value)}
              required
            />

            <FormInput
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={ACCESS_STATUS}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}