'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewJobsCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    employment_status: '',
    aca_full_time: false,
    employee_name: '',
    note: '',
    location: '',
    department: '',
    job_title: '',
    reports_to: '',
    pay_rate: '',
    pay_type: '',
    pay_schedule: '',
    bonus_amount: '',
    bonus_date: '',
    bonus_reason: '',
    bonus_comment: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/jobs-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pay_rate: parseInt(formData.pay_rate),
          bonus_amount: formData.bonus_amount ? parseInt(formData.bonus_amount) : null,
          bonus_date: formData.bonus_date || null
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/jobs-card');
      } else {
        alert('Failed to create jobs card: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating jobs card:', error);
      alert('Failed to create jobs card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/jobs-card">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs Cards
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Jobs Card</CardTitle>
          <CardDescription>Add new employee job information and compensation details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee_name">Employee Name *</Label>
                <Input
                  id="employee_name"
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status *</Label>
                <Select
                  name="employment_status"
                  value={formData.employment_status}
                  onValueChange={(value) => handleSelectChange('employment_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reports_to">Reports To *</Label>
                <Input
                  id="reports_to"
                  name="reports_to"
                  value={formData.reports_to}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay_type">Pay Type *</Label>
                <Select
                  name="pay_type"
                  value={formData.pay_type}
                  onValueChange={(value) => handleSelectChange('pay_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pay type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Commission">Commission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay_rate">Pay Rate *</Label>
                <Input
                  id="pay_rate"
                  name="pay_rate"
                  type="number"
                  value={formData.pay_rate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay_schedule">Pay Schedule *</Label>
                <Select
                  name="pay_schedule"
                  value={formData.pay_schedule}
                  onValueChange={(value) => handleSelectChange('pay_schedule', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-center">
                <Checkbox
                  id="aca_full_time"
                  name="aca_full_time"
                  checked={formData.aca_full_time}
                  onCheckedChange={(checked) => handleSelectChange('aca_full_time', checked)}
                />
                <Label htmlFor="aca_full_time" className="ml-2">ACA Full Time</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Bonus Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bonus_amount">Bonus Amount</Label>
                  <Input
                    id="bonus_amount"
                    name="bonus_amount"
                    type="number"
                    value={formData.bonus_amount}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus_date">Bonus Date</Label>
                  <Input
                    id="bonus_date"
                    name="bonus_date"
                    type="date"
                    value={formData.bonus_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus_reason">Bonus Reason</Label>
                  <Input
                    id="bonus_reason"
                    name="bonus_reason"
                    value={formData.bonus_reason}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus_comment">Bonus Comment</Label>
                  <Input
                    id="bonus_comment"
                    name="bonus_comment"
                    value={formData.bonus_comment}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/jobs-card">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Jobs Card
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}