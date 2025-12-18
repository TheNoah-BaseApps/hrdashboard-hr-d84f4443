'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricsCard from '@/components/dashboard/MetricsCard';
import WorkflowMetrics from '@/components/dashboard/WorkflowMetrics';
import AlertsList from '@/components/dashboard/AlertsList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, ClipboardList, Briefcase, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [metricsRes, alertsRes] = await Promise.all([
          fetch('/api/dashboard/metrics'),
          fetch('/api/dashboard/alerts')
        ]);

        if (!metricsRes.ok || !alertsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const metricsData = await metricsRes.json();
        const alertsData = await alertsRes.json();

        setMetrics(metricsData.data);
        setAlerts(alertsData.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Employees"
            value={metrics?.totalEmployees || 0}
            icon={Users}
            trend={metrics?.employeeTrend}
            color="blue"
          />
          <MetricsCard
            title="Active Access"
            value={metrics?.activeAccess || 0}
            icon={UserCheck}
            trend={metrics?.accessTrend}
            color="green"
          />
          <MetricsCard
            title="Onboarding Tasks"
            value={metrics?.onboardingTasks || 0}
            icon={ClipboardList}
            trend={metrics?.onboardingTrend}
            color="purple"
          />
          <MetricsCard
            title="Active Staffing Plans"
            value={metrics?.activeStaffing || 0}
            icon={Briefcase}
            trend={metrics?.staffingTrend}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WorkflowMetrics metrics={metrics} />
          <AlertsList alerts={alerts} />
        </div>
      </div>
    </DashboardLayout>
  );
}