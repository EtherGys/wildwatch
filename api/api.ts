import AsyncStorage from '@react-native-async-storage/async-storage';

const MARKERS_KEY = 'markers';

export type Marker = {
  latitude: number;
  longitude: number;
  name?: string;
  dateISO?: string; 
  photoUri?: string; 
};

export async function getMarkers(): Promise<Marker[]> {
  try {
    const raw = await AsyncStorage.getItem(MARKERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((m) => typeof m?.latitude === 'number' && typeof m?.longitude === 'number');
    }
    return [];
  } catch {
    return [];
  }
}

export async function upsertMarker(marker: Marker): Promise<void> {
  const existing = await getMarkers();
  const idx = existing.findIndex(
    (m) => m.latitude == marker.latitude && m.longitude == marker.longitude
  );
  if (idx >= 0) {
    existing[idx] = { ...existing[idx], ...marker };
    await AsyncStorage.setItem(MARKERS_KEY, JSON.stringify(existing));
  } else {
    const next = [...existing, marker];
    await AsyncStorage.setItem(MARKERS_KEY, JSON.stringify(next));
  }
}

export async function removeMarker(marker: Marker): Promise<void> {
  const existing = await getMarkers();
  const next = existing.filter(
    (m) => !((m.latitude, marker.latitude) && m.longitude == marker.longitude)
  );
  await AsyncStorage.setItem(MARKERS_KEY, JSON.stringify(next));
}

export async function getMarkerByCoords(latitude: number, longitude: number): Promise<Marker | undefined> {
  const all = await getMarkers();
  return all.find((m) => m.latitude == latitude && m.longitude == longitude);
}


