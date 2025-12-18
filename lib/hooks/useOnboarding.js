'use client';

import { useState, useEffect, useCallback } from 'react';

export function useOnboarding() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);

      const response = await fetch(`/api/employee-onboarding?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch onboarding tasks');
      }

      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const response = await fetch('/api/employee-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      await fetchTasks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`/api/employee-onboarding/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/employee-onboarding/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}