'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, DollarSign } from 'lucide-react';

export default function CompensationPlanningPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    approval_status: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  async function fetchRecords() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.approval_status) params.append('approval_status', filters.approval_status);
      
      const res = await fetch(`/api/compensation-planning?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const res = await fetch(`/api/compensation-planning/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        fetchRecords();
      } else {
        alert('Failed to delete record');
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record');
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Compensation Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage salary reviews and compensation adjustments
          </p>
        </div>
        <Link href="/compensation-planning/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
          <CardDescription>Filter compensation planning records by department or approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval_status">Approval Status</Label>
              <Select
                value={filters.approval_status}
                onValueChange={(value) => setFilters({ ...filters, approval_status: value })}
              >
                <SelectTrigger id="approval_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({records.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No compensation planning records found.</p>
              <Link href="/compensation-planning/new">
                <Button className="mt-4">Create First Review</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Salary</TableHead>
                  <TableHead>Proposed Increase</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Decision Maker</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{record.employee_name}</div>
                        <div className="text-sm text-muted-foreground">{record.employee_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>${record.current_salary?.toLocaleString()}</TableCell>
                    <TableCell>${record.proposed_increase?.toLocaleString()}</TableCell>
                    <TableCell>{new Date(record.review_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.approval_status)}>
                        {record.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.decision_maker}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/compensation-planning/${record.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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