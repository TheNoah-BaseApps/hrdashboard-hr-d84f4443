'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import StaffingForm from './StaffingForm';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Pencil, Calendar, User, DollarSign, Target, Check, X } from 'lucide-react';

export default function StaffingDetail({ plan, onUpdate }) {
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
        <StaffingForm
          initialData={plan}
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
          Edit Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staffing Plan Information</CardTitle>
            <StatusBadge status={plan.status} type="staffing" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Recruiting Budget</p>
                <p className="text-base font-semibold">{formatCurrency(plan.recruiting_source_budget)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Hire Goal</p>
                <p className="text-base">{plan.hire_goal} positions</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {plan.funded ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Funding Status</p>
                <p className="text-base">{plan.funded ? 'Funded' : 'Not Funded'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <p className="text-base">{plan.assigned_to}</p>
              </div>
            </div>

            {plan.comments && (
              <div className="flex items-start space-x-3 md:col-span-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Comments</p>
                  <p className="text-base text-gray-700">{plan.comments}</p>
                </div>
              </div>
            )}
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
                <p className="text-base">{formatDate(plan.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base">{formatDate(plan.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}