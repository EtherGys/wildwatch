import type { Marker as SavedMarker } from '@/utils/markersStorage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type MapProps = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  onReady?: () => void;
  onPress?: (coords: { latitude: number; longitude: number }) => void;
  selectedCoordinate?: { latitude: number; longitude: number } | null;
  savedMarkers?: SavedMarker[];
  onSavedMarkerPress?: (marker: SavedMarker) => void;
};

export default function Map({
  latitude,
  longitude,
  latitudeDelta = 0.01,
  longitudeDelta = 0.01,
  onReady,
  onPress,
  selectedCoordinate,
  savedMarkers,
  onSavedMarkerPress,
}: MapProps) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onMapReady={onReady}
        onPress={(e: MapPressEvent) => {
          const { coordinate } = e.nativeEvent;
          if (onPress && coordinate) {
            onPress({ latitude: coordinate.latitude, longitude: coordinate.longitude });
          }
        }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
        {selectedCoordinate && (
          <Marker coordinate={selectedCoordinate} pinColor={'#0a84ff'} />
        )}
        {savedMarkers?.map((m, idx) => (
          <Marker
            key={`${m.latitude}-${m.longitude}-${idx}`}
            coordinate={m}
            onPress={() => onSavedMarkerPress && onSavedMarkerPress(m)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
