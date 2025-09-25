import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Linking } from 'react-native';

interface UseCurrentPositionResult {
  location: Location.LocationObject | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
  retry: () => void;
  openSettings: () => void;
}

export function useCurrentPosition(): UseCurrentPositionResult {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission refusée ou indisponible.');
        setLocation(null);
        setPermissionDenied(true);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    } catch (err) {
      setError('Impossible de récupérer la localisation.');
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch au montage
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const openSettings = () => {
    Linking.openSettings();
  };

  return {
    location,
    error,
    loading,
    permissionDenied,
    retry: getCurrentLocation,
    openSettings,
  };
}
