'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const variants = {
  success: 'default',
  error: 'destructive',
  info: 'default',
  warning: 'default'
};

export default function AlertNotification({ type = 'info', title, message, className = '' }) {
  const Icon = icons[type];
  const variant = variants[type];

  return (
    <Alert variant={variant} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}