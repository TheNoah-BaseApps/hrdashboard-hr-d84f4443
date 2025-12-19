'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewGoalSettingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kpi: '',
    type: '',
    purpose: '',
    definition: '',
    target: '',
    kpi_low_comment: '',
    kpi_high_comment: '',
    collection_frequency: 'Monthly',
    reporting_frequency: 'Monthly',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/goal-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/goal-settings');
      } else {
        alert(data.error || 'Failed to create goal setting');
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      alert('Failed to create goal setting');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/goal-settings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goal Settings
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New KPI / Goal Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kpi">KPI *</Label>
                <Input
                  id="kpi"
                  name="kpi"
                  value={formData.kpi}
                  onChange={handleChange}
                  placeholder="e.g., Customer Satisfaction Score"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g., Performance, Quality"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition">Definition *</Label>
              <Textarea
                id="definition"
                name="definition"
                value={formData.definition}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target *</Label>
              <Input
                id="target"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="e.g., 95%, $1M"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kpi_low_comment">KPI Low Comment</Label>
                <Textarea
                  id="kpi_low_comment"
                  name="kpi_low_comment"
                  value={formData.kpi_low_comment}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Comment when KPI is below target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpi_high_comment">KPI High Comment</Label>
                <Textarea
                  id="kpi_high_comment"
                  name="kpi_high_comment"
                  value={formData.kpi_high_comment}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Comment when KPI exceeds target"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection_frequency">Collection Frequency *</Label>
                <Select
                  value={formData.collection_frequency}
                  onValueChange={(value) => handleSelectChange('collection_frequency', value)}
                >
                  <SelectTrigger id="collection_frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporting_frequency">Reporting Frequency *</Label>
                <Select
                  value={formData.reporting_frequency}
                  onValueChange={(value) => handleSelectChange('reporting_frequency', value)}
                >
                  <SelectTrigger id="reporting_frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create KPI
              </Button>
              <Link href="/goal-settings">
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