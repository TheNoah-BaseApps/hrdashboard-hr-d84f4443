'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPayrollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ssn: '',
    address: '',
    occupation: '',
    gender: '',
    hire_date: '',
    salary: '',
    regular_hourly_rate: '',
    overtime_hourly_rate: '',
    exempt_from_overtime: false,
    federal_allowances: '',
    retirement_contribution: '',
    insurance_deduction: '',
    other_deductions: ''
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
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: parseInt(formData.salary),
          regular_hourly_rate: formData.regular_hourly_rate ? parseInt(formData.regular_hourly_rate) : null,
          overtime_hourly_rate: formData.overtime_hourly_rate ? parseInt(formData.overtime_hourly_rate) : null,
          federal_allowances: parseInt(formData.federal_allowances),
          retirement_contribution: formData.retirement_contribution ? parseInt(formData.retirement_contribution) : null,
          insurance_deduction: formData.insurance_deduction ? parseInt(formData.insurance_deduction) : null,
          other_deductions: formData.other_deductions ? parseInt(formData.other_deductions) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/payroll');
      } else {
        alert('Failed to create payroll record: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating payroll record:', error);
      alert('Failed to create payroll record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/payroll">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payroll
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Payroll Record</CardTitle>
          <CardDescription>Add new employee payroll and compensation information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssn">SSN *</Label>
                  <Input
                    id="ssn"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleChange}
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hire_date">Hire Date *</Label>
                  <Input
                    id="hire_date"
                    name="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regular_hourly_rate">Regular Hourly Rate</Label>
                  <Input
                    id="regular_hourly_rate"
                    name="regular_hourly_rate"
                    type="number"
                    value={formData.regular_hourly_rate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overtime_hourly_rate">Overtime Hourly Rate</Label>
                  <Input
                    id="overtime_hourly_rate"
                    name="overtime_hourly_rate"
                    type="number"
                    value={formData.overtime_hourly_rate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 flex items-center">
                  <Checkbox
                    id="exempt_from_overtime"
                    name="exempt_from_overtime"
                    checked={formData.exempt_from_overtime}
                    onCheckedChange={(checked) => handleSelectChange('exempt_from_overtime', checked)}
                  />
                  <Label htmlFor="exempt_from_overtime" className="ml-2">Exempt From Overtime</Label>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Tax & Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="federal_allowances">Federal Allowances *</Label>
                  <Input
                    id="federal_allowances"
                    name="federal_allowances"
                    type="number"
                    value={formData.federal_allowances}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirement_contribution">Retirement Contribution</Label>
                  <Input
                    id="retirement_contribution"
                    name="retirement_contribution"
                    type="number"
                    value={formData.retirement_contribution}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance_deduction">Insurance Deduction</Label>
                  <Input
                    id="insurance_deduction"
                    name="insurance_deduction"
                    type="number"
                    value={formData.insurance_deduction}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="other_deductions">Other Deductions</Label>
                  <Input
                    id="other_deductions"
                    name="other_deductions"
                    type="number"
                    value={formData.other_deductions}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/payroll">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Payroll Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}