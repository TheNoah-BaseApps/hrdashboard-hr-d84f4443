'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EmployeeRewardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchReward();
    }
  }, [params.id]);

  async function fetchReward() {
    try {
      const res = await fetch(`/api/employee-rewards/${params.id}`);
      const data = await res.json();

      if (data.success) {
        const reward = data.data;
        setFormData({
          ...reward,
          date: reward.date?.split('T')[0] || '',
        });
      } else {
        alert(data.error || 'Failed to fetch reward');
        router.push('/employee-rewards');
      }
    } catch (err) {
      console.error('Error fetching reward:', err);
      alert('Failed to load reward');
      router.push('/employee-rewards');
    } finally {
      setLoading(false);
    }
  }

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
    setSaving(true);

    try {
      const res = await fetch(`/api/employee-rewards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/employee-rewards');
      } else {
        alert(data.error || 'Failed to update reward');
      }
    } catch (err) {
      console.error('Error updating reward:', err);
      alert('Failed to update reward');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
          <CardTitle>Edit Employee Reward</CardTitle>
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
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
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