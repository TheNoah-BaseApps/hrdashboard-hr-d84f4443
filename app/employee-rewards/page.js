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

export default function EmployeeRewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  async function fetchRewards() {
    try {
      setLoading(true);
      const res = await fetch('/api/employee-rewards');
      const data = await res.json();
      
      if (data.success) {
        setRewards(data.data);
      } else {
        setError(data.error || 'Failed to fetch rewards');
      }
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      const res = await fetch(`/api/employee-rewards/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        fetchRewards();
      } else {
        alert(data.error || 'Failed to delete reward');
      }
    } catch (err) {
      console.error('Error deleting reward:', err);
      alert('Failed to delete reward');
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
          <h1 className="text-3xl font-bold">Employee Rewards</h1>
          <p className="text-muted-foreground mt-1">Manage employee benefits and rewards programs</p>
        </div>
        <Link href="/employee-rewards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reward
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
          <CardTitle>Rewards & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No employee rewards found</p>
              <Link href="/employee-rewards/new">
                <Button variant="outline">Add Your First Reward</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benefit Type</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Employee Pays</TableHead>
                  <TableHead>Company Pays</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      <Badge variant="outline">{reward.benefit_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{reward.plan_name}</TableCell>
                    <TableCell>{reward.coverage}</TableCell>
                    <TableCell>${reward.employee_pays.toLocaleString()}</TableCell>
                    <TableCell>${reward.company_pays.toLocaleString()}</TableCell>
                    <TableCell>{reward.frequency}</TableCell>
                    <TableCell>{new Date(reward.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/employee-rewards/${reward.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reward.id)}
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