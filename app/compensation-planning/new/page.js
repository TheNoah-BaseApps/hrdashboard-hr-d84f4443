'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, DollarSign } from 'lucide-react';

export default function NewCompensationPlanningPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    employee_id: '',
    department: '',
    current_salary: '',
    proposed_increase: '',
    review_date: '',
    approval_status: 'Pending',
    remarks: '',
    decision_maker: '',
    effective_date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/compensation-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          current_salary: parseInt(formData.current_salary),
          proposed_increase: parseInt(formData.proposed_increase)
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push('/compensation-planning');
      } else {
        alert('Failed to create record: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating record:', err);
      alert('Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/compensation-planning">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          New Compensation Review
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a new salary review and compensation planning record
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
            <CardDescription>Enter the compensation planning information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_name">Employee Name *</Label>
                <Input
                  id="employee_name"
                  required
                  value={formData.employee_name}
                  onChange={(e) => handleChange('employee_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  required
                  value={formData.employee_id}
                  onChange={(e) => handleChange('employee_id', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decision_maker">Decision Maker *</Label>
                <Input
                  id="decision_maker"
                  required
                  value={formData.decision_maker}
                  onChange={(e) => handleChange('decision_maker', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_salary">Current Salary *</Label>
                <Input
                  id="current_salary"
                  type="number"
                  required
                  value={formData.current_salary}
                  onChange={(e) => handleChange('current_salary', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proposed_increase">Proposed Increase *</Label>
                <Input
                  id="proposed_increase"
                  type="number"
                  required
                  value={formData.proposed_increase}
                  onChange={(e) => handleChange('proposed_increase', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="review_date">Review Date *</Label>
                <Input
                  id="review_date"
                  type="date"
                  required
                  value={formData.review_date}
                  onChange={(e) => handleChange('review_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effective_date">Effective Date *</Label>
                <Input
                  id="effective_date"
                  type="date"
                  required
                  value={formData.effective_date}
                  onChange={(e) => handleChange('effective_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval_status">Approval Status *</Label>
              <Select
                value={formData.approval_status}
                onValueChange={(value) => handleChange('approval_status', value)}
              >
                <SelectTrigger id="approval_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                rows={4}
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Review'}
              </Button>
              <Link href="/compensation-planning">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}