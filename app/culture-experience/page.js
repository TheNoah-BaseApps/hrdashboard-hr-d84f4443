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
import { Trash2, Edit, Plus, Heart } from 'lucide-react';

export default function CultureExperiencePage() {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    status: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchInitiatives();
  }, [filters]);

  async function fetchInitiatives() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      
      const res = await fetch(`/api/culture-experience?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setInitiatives(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching initiatives:', err);
      setError('Failed to load initiatives');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this initiative?')) return;
    
    try {
      const res = await fetch(`/api/culture-experience/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        fetchInitiatives();
      } else {
        alert('Failed to delete initiative');
      }
    } catch (err) {
      console.error('Error deleting initiative:', err);
      alert('Failed to delete initiative');
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Planned': 'bg-blue-100 text-blue-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
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
            <Heart className="h-8 w-8" />
            Culture and Experience
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage culture and employee experience initiatives
          </p>
        </div>
        <Link href="/culture-experience/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Initiative
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Initiatives</CardTitle>
          <CardDescription>Filter initiatives by department or status</CardDescription>
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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
          <CardTitle>All Initiatives ({initiatives.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {initiatives.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No culture and experience initiatives found.</p>
              <Link href="/culture-experience/new">
                <Button className="mt-4">Create First Initiative</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Initiative</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initiatives.map((initiative) => (
                  <TableRow key={initiative.id}>
                    <TableCell className="font-medium">{initiative.initiative_name}</TableCell>
                    <TableCell>{initiative.team_involved}</TableCell>
                    <TableCell>{initiative.department}</TableCell>
                    <TableCell>{new Date(initiative.date_of_initiative).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(initiative.status)}>
                        {initiative.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{initiative.contact_person}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/culture-experience/${initiative.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(initiative.id)}
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