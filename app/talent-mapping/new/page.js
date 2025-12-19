'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewTalentMappingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    name_surname: '',
    department: '',
    position: '',
    years_of_experience: '',
    job_level: '',
    age: '',
    performance: '',
    potential: '',
    box_categorization: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/talent-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          years_of_experience: parseInt(formData.years_of_experience),
          age: parseInt(formData.age)
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push('/talent-mapping');
      } else {
        alert('Error creating entry: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating entry:', err);
      alert('Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Talent Mapping Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">Employee ID *</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name_surname">Name Surname *</Label>
                <Input
                  id="name_surname"
                  name="name_surname"
                  value={formData.name_surname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="years_of_experience">Years of Experience *</Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  type="number"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="job_level">Job Level *</Label>
                <Input
                  id="job_level"
                  name="job_level"
                  value={formData.job_level}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="performance">Performance *</Label>
                <Input
                  id="performance"
                  name="performance"
                  value={formData.performance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="potential">Potential *</Label>
                <Input
                  id="potential"
                  name="potential"
                  value={formData.potential}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="box_categorization">Box Categorization *</Label>
                <Input
                  id="box_categorization"
                  name="box_categorization"
                  value={formData.box_categorization}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Entry'}
              </Button>
              <Link href="/talent-mapping">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}