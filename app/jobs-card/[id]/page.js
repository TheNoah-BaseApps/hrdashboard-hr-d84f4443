'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function JobsCardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchJobCard();
    }
  }, [params.id]);

  async function fetchJobCard() {
    try {
      const response = await fetch(`/api/jobs-card/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setJobCard(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching jobs card:', err);
      setError('Failed to load jobs card');
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

  if (error || !jobCard) {
    return (
      <div className="container mx-auto p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error || 'Jobs card not found'}</p>
            <Link href="/jobs-card">
              <Button className="mt-4">Back to Jobs Cards</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/jobs-card">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs Cards
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{jobCard.employee_name}</CardTitle>
              <CardDescription>{jobCard.job_title}</CardDescription>
            </div>
            <Badge variant="outline">{jobCard.employment_status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(jobCard.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{jobCard.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{jobCard.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reports To:</span>
                  <span>{jobCard.reports_to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ACA Full Time:</span>
                  <span>{jobCard.aca_full_time ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Compensation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pay Type:</span>
                  <span>{jobCard.pay_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pay Rate:</span>
                  <span className="font-semibold">${jobCard.pay_rate?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pay Schedule:</span>
                  <span>{jobCard.pay_schedule}</span>
                </div>
              </div>
            </div>
          </div>

          {jobCard.note && (
            <div>
              <h3 className="font-semibold mb-2">Note</h3>
              <p className="text-sm text-muted-foreground">{jobCard.note}</p>
            </div>
          )}

          {(jobCard.bonus_amount || jobCard.bonus_date || jobCard.bonus_reason) && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Bonus Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {jobCard.bonus_amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Amount:</span>
                    <span className="font-semibold">${jobCard.bonus_amount?.toLocaleString()}</span>
                  </div>
                )}
                {jobCard.bonus_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Date:</span>
                    <span>{new Date(jobCard.bonus_date).toLocaleDateString()}</span>
                  </div>
                )}
                {jobCard.bonus_reason && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Reason:</span>
                    <span>{jobCard.bonus_reason}</span>
                  </div>
                )}
                {jobCard.bonus_comment && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Bonus Comment:</span>
                    <p className="mt-1">{jobCard.bonus_comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-6 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Created: {new Date(jobCard.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(jobCard.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}