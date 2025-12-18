'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, AlertCircle } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('access-management');
  const [exportFormat, setExportFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const endpoint = `/api/${reportType}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      
      if (exportFormat === 'csv') {
        exportToCSV(data.data, reportType);
      } else if (exportFormat === 'json') {
        exportToJSON(data.data, reportType);
      }

      setSuccess('Report generated successfully!');
    } catch (err) {
      console.error('Report generation error:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, type) => {
    if (!data || data.length === 0) {
      setError('No data available for export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data, type) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Export workflow data for analysis and record-keeping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access-management">Access Management</SelectItem>
                    <SelectItem value="employee-onboarding">Employee Onboarding</SelectItem>
                    <SelectItem value="employee-staffing">Employee Staffing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleGenerateReport} 
                disabled={loading}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Generate & Download Report'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Quick access to common reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium">Access Management Summary</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Overview of all access grants, expiry dates, and status
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium">Onboarding Progress</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Track onboarding tasks, completion rates, and overdue items
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium">Staffing Budget Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recruitment budgets, hiring goals, and funding status
                </p>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium">Workflow Audit Trail</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Complete history of all workflow activities and changes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}