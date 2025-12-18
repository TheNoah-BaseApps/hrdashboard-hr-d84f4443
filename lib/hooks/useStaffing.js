'use client';

import { useState, useEffect, useCallback } from 'react';

export function useStaffing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.funded !== undefined) params.append('funded', filters.funded);

      const response = await fetch(`/api/employee-staffing?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch staffing plans');
      }

      const data = await response.json();
      setPlans(data.data || []);
    } catch (err) {
      console.error('Fetch plans error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = async (planData) => {
    try {
      const response = await fetch('/api/employee-staffing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create plan');
      }

      await fetchPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePlan = async (id, planData) => {
    try {
      const response = await fetch(`/api/employee-staffing/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      await fetchPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePlan = async (id) => {
    try {
      const response = await fetch(`/api/employee-staffing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      await fetchPlans();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan
  };
}