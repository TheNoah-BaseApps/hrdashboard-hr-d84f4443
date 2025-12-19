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
import { ArrowLeft, Heart } from 'lucide-react';

export default function EditCultureExperiencePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchInitiative();
  }, []);

  async function fetchInitiative() {
    try {
      const res = await fetch(`/api/culture-experience/${params.id}`);
      const data = await res.json();
      
      if (data.success) {
        const initiative = data.data;
        setFormData({
          initiative_name: initiative.initiative_name,
          team_involved: initiative.team_involved,
          date_of_initiative: initiative.date_of_initiative.split('T')[0],
          department: initiative.department,
          feedback: initiative.feedback || '',
          status: initiative.status,
          contact_person: initiative.contact_person,
          action_plan: initiative.action_plan || ''
        });
      }
    } catch (err) {
      console.error('Error fetching initiative:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/culture-experience/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/culture-experience');
      } else {
        alert('Failed to update initiative: ' + data.error);
      }
    } catch (err) {
      console.error('Error updating initiative:', err);
      alert('Failed to update initiative');
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
        <div className="text-center">Initiative not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/culture-experience">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8" />
          Edit Culture Initiative
        </h1>
        <p className="text-muted-foreground mt-1">
          Update culture and employee experience initiative
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Initiative Details</CardTitle>
            <CardDescription>Update the initiative information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initiative_name">Initiative Name *</Label>
              <Input
                id="initiative_name"
                required
                value={formData.initiative_name}
                onChange={(e) => handleChange('initiative_name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team_involved">Team Involved *</Label>
                <Input
                  id="team_involved"
                  required
                  value={formData.team_involved}
                  onChange={(e) => handleChange('team_involved', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_initiative">Date of Initiative *</Label>
                <Input
                  id="date_of_initiative"
                  type="date"
                  required
                  value={formData.date_of_initiative}
                  onChange={(e) => handleChange('date_of_initiative', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  required
                  value={formData.contact_person}
                  onChange={(e) => handleChange('contact_person', e.target.value)}
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
              <Label htmlFor="action_plan">Action Plan</Label>
              <Textarea
                id="action_plan"
                rows={4}
                value={formData.action_plan}
                onChange={(e) => handleChange('action_plan', e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/culture-experience">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}