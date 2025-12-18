'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, ClipboardList, Briefcase } from 'lucide-react';

export default function WorkflowMetrics({ metrics }) {
  const workflows = [
    {
      name: 'Access Management',
      icon: UserCheck,
      active: metrics?.activeAccess || 0,
      expired: metrics?.expiredAccess || 0,
      pending: metrics?.pendingAccess || 0,
      color: 'text-blue-600'
    },
    {
      name: 'Employee Onboarding',
      icon: ClipboardList,
      active: metrics?.activeOnboarding || 0,
      completed: metrics?.completedOnboarding || 0,
      overdue: metrics?.overdueOnboarding || 0,
      color: 'text-purple-600'
    },
    {
      name: 'Employee Staffing',
      icon: Briefcase,
      active: metrics?.activeStaffing || 0,
      funded: metrics?.fundedStaffing || 0,
      unfunded: metrics?.unfundedStaffing || 0,
      color: 'text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <div key={workflow.name} className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 ${workflow.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{workflow.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {Object.entries(workflow).map(([key, value]) => {
                      if (key === 'name' || key === 'icon' || key === 'color') return null;
                      return (
                        <div key={key}>
                          <span className="text-gray-500 capitalize">{key}: </span>
                          <span className="font-semibold text-gray-900">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}