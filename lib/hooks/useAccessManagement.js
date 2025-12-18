'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAccessManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);

      const response = await fetch(`/api/access-management?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch access management records');
      }

      const data = await response.json();
      setRecords(data.data || []);
    } catch (err) {
      console.error('Fetch records error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const createRecord = async (recordData) => {
    try {
      const response = await fetch('/api/access-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create record');
      }

      await fetchRecords();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateRecord = async (id, recordData) => {
    try {
      const response = await fetch(`/api/access-management/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error('Failed to update record');
      }

      await fetchRecords();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteRecord = async (id) => {
    try {
      const response = await fetch(`/api/access-management/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      await fetchRecords();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  };
}