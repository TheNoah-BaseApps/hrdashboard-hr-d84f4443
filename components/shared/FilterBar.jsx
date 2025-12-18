'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters = [], onFilter }) {
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFilter(filterValues);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onFilter({});
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {filters.map((filter) => (
          <div key={filter.key} className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {filter.label}
            </label>
            {filter.type === 'text' && (
              <Input
                type="text"
                placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              />
            )}
            {filter.type === 'select' && (
              <Select
                value={filterValues[filter.key] || 'all'}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
        
        <div className="flex gap-2">
          <Button onClick={handleApplyFilters}>
            <Search className="mr-2 h-4 w-4" />
            Apply
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}