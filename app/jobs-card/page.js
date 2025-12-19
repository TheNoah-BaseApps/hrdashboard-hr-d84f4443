'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Loader2 } from 'lucide-react';

export default function JobsCardPage() {
  const [jobsCards, setJobsCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobsCards();
  }, []);

  async function fetchJobsCards() {
    try {
      const response = await fetch('/api/jobs-card');
      const data = await response.json();
      
      if (data.success) {
        setJobsCards(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching jobs cards:', err);
      setError('Failed to load jobs cards');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this jobs card?')) return;

    try {
      const response = await fetch(`/api/jobs-card/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setJobsCards(jobsCards.filter(card => card.id !== id));
      } else {
        alert('Failed to delete jobs card');
      }
    } catch (err) {
      console.error('Error deleting jobs card:', err);
      alert('Failed to delete jobs card');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Jobs Card
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage employee job information and compensation details
          </p>
        </div>
        <Link href="/jobs-card/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Jobs Card
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {jobsCards.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs cards yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first jobs card
              </p>
              <Link href="/jobs-card/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Jobs Card
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobsCards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{card.employee_name}</span>
                  <Badge variant="outline">{card.employment_status}</Badge>
                </CardTitle>
                <CardDescription>{card.job_title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{card.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{card.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pay Type:</span>
                    <span className="font-medium">{card.pay_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pay Rate:</span>
                    <span className="font-medium">${card.pay_rate?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reports To:</span>
                    <span className="font-medium">{card.reports_to}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/jobs-card/${card.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(card.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}