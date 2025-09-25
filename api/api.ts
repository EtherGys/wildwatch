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
const idx = existing.findIndex((m) => areCoordsEqual(m, marker));
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
  const next = existing.filter((m) => !areCoordsEqual(m, marker));
  await AsyncStorage.setItem(MARKERS_KEY, JSON.stringify(next));
}


export async function getMarkerByCoords(latitude: number, longitude: number): Promise<Marker | undefined> {
  const all = await getMarkers();
return all.find((m) => Math.abs(m.latitude - latitude) < 1e-6 && Math.abs(m.longitude - longitude) < 1e-6);

}

function areCoordsEqual(a: Marker, b: Marker, epsilon = 1e-6): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < epsilon &&
    Math.abs(a.longitude - b.longitude) < epsilon
  );
}

