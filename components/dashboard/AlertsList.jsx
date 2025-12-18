'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

export default function AlertsList({ alerts }) {
  if (!alerts || (alerts.expiringAccess?.length === 0 && alerts.overdueTasks?.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-8">No alerts at this time</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.expiringAccess?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              Expiring Access ({alerts.expiringAccess.length})
            </h3>
            <div className="space-y-2">
              {alerts.expiringAccess.map((item) => (
                <Alert key={item.id} variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">{item.employee_name}</span> - 
                    {' '}{item.system_access} access expires on {formatDate(item.expiry_date)}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {alerts.overdueTasks?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-red-600" />
              Overdue Tasks ({alerts.overdueTasks.length})
            </h3>
            <div className="space-y-2">
              {alerts.overdueTasks.map((task) => (
                <Alert key={task.id} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">{task.task}</span> for {task.name_of_employee}
                    {' '}was due on {formatDate(task.due_date)}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}