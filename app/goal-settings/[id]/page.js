'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function GoalSettingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchGoal();
    }
  }, [params.id]);

  async function fetchGoal() {
    try {
      const res = await fetch(`/api/goal-settings/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setFormData(data.data);
      } else {
        alert(data.error || 'Failed to fetch goal setting');
        router.push('/goal-settings');
      }
    } catch (err) {
      console.error('Error fetching goal:', err);
      alert('Failed to load goal setting');
      router.push('/goal-settings');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/goal-settings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/goal-settings');
      } else {
        alert(data.error || 'Failed to update goal setting');
      }
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Failed to update goal setting');
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
        <Link href="/goal-settings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goal Settings
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit KPI / Goal Setting</CardTitle>
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
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kpi_low_comment">KPI Low Comment</Label>
                <Textarea
                  id="kpi_low_comment"
                  name="kpi_low_comment"
                  value={formData.kpi_low_comment || ''}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpi_high_comment">KPI High Comment</Label>
                <Textarea
                  id="kpi_high_comment"
                  name="kpi_high_comment"
                  value={formData.kpi_high_comment || ''}
                  onChange={handleChange}
                  rows={2}
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
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
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