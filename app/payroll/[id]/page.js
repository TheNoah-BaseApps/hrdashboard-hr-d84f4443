'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchRecord();
    }
  }, [params.id]);

  async function fetchRecord() {
    try {
      const response = await fetch(`/api/payroll/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setRecord(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching payroll record:', err);
      setError('Failed to load payroll record');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error || 'Payroll record not found'}</p>
            <Link href="/payroll">
              <Button className="mt-4">Back to Payroll</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/payroll">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payroll
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{record.name}</CardTitle>
          <CardDescription>{record.occupation}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SSN:</span>
                  <span>{record.ssn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{record.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hire Date:</span>
                  <span>{new Date(record.hire_date).toLocaleDateString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Address:</span>
                  <p className="mt-1">{record.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Compensation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-semibold">${record.salary?.toLocaleString()}</span>
                </div>
                {record.regular_hourly_rate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regular Hourly Rate:</span>
                    <span>${record.regular_hourly_rate}</span>
                  </div>
                )}
                {record.overtime_hourly_rate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overtime Hourly Rate:</span>
                    <span>${record.overtime_hourly_rate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exempt From Overtime:</span>
                  <span>{record.exempt_from_overtime ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Tax & Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Federal Allowances:</span>
                <span>{record.federal_allowances}</span>
              </div>
              {record.retirement_contribution && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retirement Contribution:</span>
                  <span>${record.retirement_contribution?.toLocaleString()}</span>
                </div>
              )}
              {record.insurance_deduction && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance Deduction:</span>
                  <span>${record.insurance_deduction?.toLocaleString()}</span>
                </div>
              )}
              {record.other_deductions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Other Deductions:</span>
                  <span>${record.other_deductions?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Created: {new Date(record.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(record.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}