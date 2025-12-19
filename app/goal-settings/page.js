'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Eye, Trash2 } from 'lucide-react';

export default function GoalSettingsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      setLoading(true);
      const res = await fetch('/api/goal-settings');
      const data = await res.json();
      
      if (data.success) {
        setGoals(data.data);
      } else {
        setError(data.error || 'Failed to fetch goal settings');
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goal settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this goal setting?')) return;

    try {
      const res = await fetch(`/api/goal-settings/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        fetchGoals();
      } else {
        alert(data.error || 'Failed to delete goal setting');
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal setting');
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
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Goal Settings / KPI Settings</h1>
          <p className="text-muted-foreground mt-1">Manage organizational KPIs and performance goals</p>
        </div>
        <Link href="/goal-settings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add KPI
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>KPI Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No goal settings found</p>
              <Link href="/goal-settings/new">
                <Button variant="outline">Create Your First KPI</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KPI</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Collection Frequency</TableHead>
                  <TableHead>Reporting Frequency</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.kpi}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{goal.type}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{goal.purpose}</TableCell>
                    <TableCell>{goal.target}</TableCell>
                    <TableCell>{goal.collection_frequency}</TableCell>
                    <TableCell>{goal.reporting_frequency}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/goal-settings/${goal.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}