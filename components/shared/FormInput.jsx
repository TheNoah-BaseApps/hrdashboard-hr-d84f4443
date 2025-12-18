'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  placeholder = '',
  options = [],
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      ) : type === 'select' ? (
        <Select value={value} onValueChange={(val) => onChange({ target: { value: val } })} {...props}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value || option} value={option.value || option}>
                {option.label || option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  );
}