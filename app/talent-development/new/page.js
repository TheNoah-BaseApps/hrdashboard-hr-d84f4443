'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewTalentDevelopmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    employee_id: '',
    department: '',
    training_program: '',
    program_start_date: '',
    program_end_date: '',
    progress_percentage: '0',
    trainer_name: '',
    completion_status: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/talent-development', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          progress_percentage: parseInt(formData.progress_percentage)
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push('/talent-development');
      } else {
        alert('Error creating program: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating program:', err);
      alert('Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Talent Development Program</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_name">Employee Name *</Label>
                <Input id="employee_name" name="employee_name" value={formData.employee_name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="training_program">Training Program *</Label>
                <Input id="training_program" name="training_program" value={formData.training_program} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="program_start_date">Program Start Date *</Label>
                <Input id="program_start_date" name="program_start_date" type="date" value={formData.program_start_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="program_end_date">Program End Date *</Label>
                <Input id="program_end_date" name="program_end_date" type="date" value={formData.program_end_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="progress_percentage">Progress Percentage *</Label>
                <Input id="progress_percentage" name="progress_percentage" type="number" min="0" max="100" value={formData.progress_percentage} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="trainer_name">Trainer Name *</Label>
                <Input id="trainer_name" name="trainer_name" value={formData.trainer_name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="completion_status">Completion Status *</Label>
                <Input id="completion_status" name="completion_status" value={formData.completion_status} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Program'}</Button>
              <Link href="/talent-development"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}