import { useState, useEffect, useCallback } from 'react';
import type { RegistrationItem } from '../types/registration';
import { registrationService } from '../services/registrationService';

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await registrationService.getRegistrations();
      setRegistrations(data);
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError(err?.message || 'Failed to load registrations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    registrations,
    isLoading,
    error,
    refetch: fetchRegistrations,
  };
};
