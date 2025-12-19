'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewRecruitmentATSPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    phone_number: '',
    position_title: '',
    date_applied: '',
    experience: '',
    question1: '',
    answer1: '',
    question2: '',
    answer2: '',
    question3: '',
    answer3: '',
    question4: '',
    answer4: '',
    question5: '',
    answer5: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/recruitment-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/recruitment-ats');
      } else {
        alert('Error creating applicant: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating applicant:', err);
      alert('Failed to create applicant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Applicant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicant_name">Applicant Name *</Label>
                <Input id="applicant_name" name="applicant_name" value={formData.applicant_name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="position_title">Position Title *</Label>
                <Input id="position_title" name="position_title" value={formData.position_title} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="date_applied">Date Applied *</Label>
                <Input id="date_applied" name="date_applied" type="date" value={formData.date_applied} onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} rows={2} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Screening Questions</h3>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <div>
                    <Label htmlFor={`question${num}`}>Question {num}</Label>
                    <Input id={`question${num}`} name={`question${num}`} value={formData[`question${num}`]} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor={`answer${num}`}>Answer {num}</Label>
                    <Textarea id={`answer${num}`} name={`answer${num}`} value={formData[`answer${num}`]} onChange={handleChange} rows={2} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Applicant'}</Button>
              <Link href="/recruitment-ats"><Button type="button" variant="outline">Cancel</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}