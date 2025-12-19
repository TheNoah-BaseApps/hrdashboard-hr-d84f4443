'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewEmployeeRewardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    benefit_type: '',
    plan_name: '',
    date: new Date().toISOString().split('T')[0],
    coverage: '',
    employee_pays: 0,
    company_pays: 0,
    frequency: 'Monthly',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('pays') ? parseInt(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/employee-rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/employee-rewards');
      } else {
        alert(data.error || 'Failed to create reward');
      }
    } catch (err) {
      console.error('Error creating reward:', err);
      alert('Failed to create reward');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/employee-rewards">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rewards
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Employee Reward</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="benefit_type">Benefit Type *</Label>
                <Input
                  id="benefit_type"
                  name="benefit_type"
                  value={formData.benefit_type}
                  onChange={handleChange}
                  placeholder="e.g., Health Insurance, Bonus"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan_name">Plan Name *</Label>
                <Input
                  id="plan_name"
                  name="plan_name"
                  value={formData.plan_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="coverage">Coverage *</Label>
                <Input
                  id="coverage"
                  name="coverage"
                  value={formData.coverage}
                  onChange={handleChange}
                  placeholder="e.g., Individual, Family"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_pays">Employee Pays ($) *</Label>
                <Input
                  id="employee_pays"
                  name="employee_pays"
                  type="number"
                  value={formData.employee_pays}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_pays">Company Pays ($) *</Label>
                <Input
                  id="company_pays"
                  name="company_pays"
                  type="number"
                  value={formData.company_pays}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                    <SelectItem value="One-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Reward
              </Button>
              <Link href="/employee-rewards">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}