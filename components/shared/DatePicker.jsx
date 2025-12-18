'use client';

import { Input } from '@/components/ui/input';

export default function DatePicker({ label, value, onChange, required = false, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <Input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}