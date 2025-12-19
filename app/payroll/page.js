'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Plus, Loader2 } from 'lucide-react';

export default function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  async function fetchPayrollRecords() {
    try {
      const response = await fetch('/api/payroll');
      const data = await response.json();
      
      if (data.success) {
        setPayrollRecords(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching payroll records:', err);
      setError('Failed to load payroll records');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this payroll record?')) return;

    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setPayrollRecords(payrollRecords.filter(record => record.id !== id));
      } else {
        alert('Failed to delete payroll record');
      }
    } catch (err) {
      console.error('Error deleting payroll record:', err);
      alert('Failed to delete payroll record');
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
            <DollarSign className="h-8 w-8" />
            Payroll
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage employee payroll and compensation information
          </p>
        </div>
        <Link href="/payroll/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Payroll Record
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

      {payrollRecords.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payroll records yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first payroll record
              </p>
              <Link href="/payroll/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Payroll Record
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {payrollRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{record.name}</CardTitle>
                <CardDescription>{record.occupation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salary:</span>
                    <span className="font-semibold">${record.salary?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span>{record.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hire Date:</span>
                    <span>{new Date(record.hire_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Federal Allowances:</span>
                    <span>{record.federal_allowances}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/payroll/${record.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(record.id)}
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