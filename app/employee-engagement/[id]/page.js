'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users } from 'lucide-react';

export default function EditEmployeeEngagementPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  async function fetchActivity() {
    try {
      const res = await fetch(`/api/employee-engagement/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        const activity = data.data;
        setFormData({
          employee_name: activity.employee_name,
          employee_id: activity.employee_id,
          department: activity.department,
          engagement_activity: activity.engagement_activity,
          date_of_activity: activity.date_of_activity.split('T')[0],
          feedback: activity.feedback || '',
          satisfaction_score: activity.satisfaction_score ? activity.satisfaction_score.toString() : '',
          suggestions: activity.suggestions || '',
          organizer: activity.organizer,
          status: activity.status
        });
      }
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/employee-engagement/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          satisfaction_score: formData.satisfaction_score ? parseInt(formData.satisfaction_score) : null
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push('/employee-engagement');
      } else {
        alert('Failed to update activity: ' + data.error);
      }
    } catch (err) {
      console.error('Error updating activity:', err);
      alert('Failed to update activity');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Activity not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/employee-engagement">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Edit Engagement Activity
        </h1>
        <p className="text-muted-foreground mt-1">
          Update employee engagement activity
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Update the activity information</CardDescription>
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
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  required
                  value={formData.organizer}
                  onChange={(e) => handleChange('organizer', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engagement_activity">Engagement Activity *</Label>
              <Input
                id="engagement_activity"
                required
                value={formData.engagement_activity}
                onChange={(e) => handleChange('engagement_activity', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_activity">Date of Activity *</Label>
                <Input
                  id="date_of_activity"
                  type="date"
                  required
                  value={formData.date_of_activity}
                  onChange={(e) => handleChange('date_of_activity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satisfaction_score">Satisfaction Score (1-10)</Label>
                <Input
                  id="satisfaction_score"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.satisfaction_score}
                  onChange={(e) => handleChange('satisfaction_score', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                rows={4}
                value={formData.feedback}
                onChange={(e) => handleChange('feedback', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestions">Suggestions</Label>
              <Textarea
                id="suggestions"
                rows={4}
                value={formData.suggestions}
                onChange={(e) => handleChange('suggestions', e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/employee-engagement">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}