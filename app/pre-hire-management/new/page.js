'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewPreHirePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pre_hire_id: '',
    candidate_name: '',
    position_applied_for: '',
    department: '',
    application_date: '',
    resume_link: '',
    interview_scheduled_date: '',
    interviewer_name: '',
    interview_status: '',
    background_check_status: '',
    offer_letter_date: '',
    offer_acceptance_date: '',
    expected_joining_date: '',
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
      const res = await fetch('/api/pre-hire-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/pre-hire-management');
      } else {
        alert('Error creating candidate: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating candidate:', err);
      alert('Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Pre Hire Candidate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pre_hire_id">Pre Hire ID *</Label>
                <Input id="pre_hire_id" name="pre_hire_id" value={formData.pre_hire_id} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="candidate_name">Candidate Name *</Label>
                <Input id="candidate_name" name="candidate_name" value={formData.candidate_name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="position_applied_for">Position Applied For *</Label>
                <Input id="position_applied_for" name="position_applied_for" value={formData.position_applied_for} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="application_date">Application Date *</Label>
                <Input id="application_date" name="application_date" type="date" value={formData.application_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="resume_link">Resume Link</Label>
                <Input id="resume_link" name="resume_link" value={formData.resume_link} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="interview_scheduled_date">Interview Scheduled Date</Label>
                <Input id="interview_scheduled_date" name="interview_scheduled_date" type="date" value={formData.interview_scheduled_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="interviewer_name">Interviewer Name</Label>
                <Input id="interviewer_name" name="interviewer_name" value={formData.interviewer_name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="interview_status">Interview Status *</Label>
                <Input id="interview_status" name="interview_status" value={formData.interview_status} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="background_check_status">Background Check Status *</Label>
                <Input id="background_check_status" name="background_check_status" value={formData.background_check_status} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="offer_letter_date">Offer Letter Date</Label>
                <Input id="offer_letter_date" name="offer_letter_date" type="date" value={formData.offer_letter_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="offer_acceptance_date">Offer Acceptance Date</Label>
                <Input id="offer_acceptance_date" name="offer_acceptance_date" type="date" value={formData.offer_acceptance_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="expected_joining_date">Expected Joining Date</Label>
                <Input id="expected_joining_date" name="expected_joining_date" type="date" value={formData.expected_joining_date} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Candidate'}</Button>
              <Link href="/pre-hire-management"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}