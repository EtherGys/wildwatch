import type { Marker as SavedMarker } from "@/api/api";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import ReanimatedMarker from "./ReanimatedMarker";

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
            onPress({
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            });
          }
        }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        }}
      >
        {/* User marker */}
        <Marker coordinate={{ latitude, longitude }} pinColor="transparent">
          {/* Other markers */}
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 16,
              backgroundColor: "#0a84ff",
              borderWidth: 2,
              borderColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
        </Marker>
        {selectedCoordinate && (
          <Marker coordinate={selectedCoordinate} pinColor={"#0a84ff"} />
        )}
        {savedMarkers?.map((m, idx) => (
          <Marker
            key={`${m.latitude}-${m.longitude}-${idx}`}
            title={m.name}
            coordinate={m}
            onPress={() => onSavedMarkerPress && onSavedMarkerPress(m)}
            pinColor="#FAA452"
          >
            <ReanimatedMarker>
              {m.photoUri && (
                <Image
                  source={{ uri: m.photoUri }}
                  style={styles.savedMarkerImage}
                />
              )}
            </ReanimatedMarker>
          </Marker>
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
    width: "100%",
    height: "100%",
  },
  savedMarkerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dba35fff",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  savedMarkerImage: {
    width: 33,
    height: 33,
    borderRadius: 15,
  },
});
