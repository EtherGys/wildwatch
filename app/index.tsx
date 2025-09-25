import { getMarkers } from "@/api/api";
import Map from "@/components/Map";
import { useCurrentPosition } from "@/hook/useCurrentPosition"; // Assure-toi que le path est correct
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {
    location,
    error,
    loading: isLoading,
    permissionDenied,
    retry,
    openSettings,
  } = useCurrentPosition();

  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [savedMarkers, setSavedMarkers] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  // Charger les markers au démarrage
  useEffect(() => {
    (async () => {
      const markers = await getMarkers();
      setSavedMarkers(markers);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const markers = await getMarkers();
        if (isActive) {
          setSavedMarkers(markers);
          setSelected(null);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        {/* Loading */}
        {isLoading && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 12 }}>
              Récupération de la localisation…
            </Text>
          </View>
        )}

        {/* Error */}
        {!isLoading && error && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              Localisation indisponible
            </Text>
            <Text style={{ textAlign: "center", color: "#555" }}>{error}</Text>
            <View
              style={{ marginTop: 16, width: "100%", alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={retry}
                style={{
                  backgroundColor: "#0a84ff",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  alignSelf: "stretch",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Réessayer
                </Text>
              </TouchableOpacity>
              {permissionDenied && (
                <TouchableOpacity
                  onPress={openSettings}
                  style={{
                    backgroundColor: "#111",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    marginTop: 10,
                    alignSelf: "stretch",
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Ouvrir les réglages
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Map */}
        {!isLoading && !error && location && (
          <View style={{ flex: 1 }}>
            <Map
              latitude={location.coords.latitude}
              longitude={location.coords.longitude}
              onReady={() => setIsMapLoading(false)}
              onPress={(coords) => {
                setSelected(coords);
                router.push({
                  pathname: "/modal",
                  params: {
                    latitude: String(coords.latitude),
                    longitude: String(coords.longitude),
                  },
                });
              }}
              selectedCoordinate={selected}
              savedMarkers={savedMarkers}
              onSavedMarkerPress={(m) => {
                router.push({
                  pathname: "/modal",
                  params: {
                    latitude: String(m.latitude),
                    longitude: String(m.longitude),
                  },
                });
              }}
            />

            {/* Map loading */}
            {isMapLoading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                <ActivityIndicator size="small" color="#0000ff" />
                <Text style={{ marginTop: 8 }}>Chargement de la carte…</Text>
              </View>
            )}

            {/* Coordinates */}
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                flexDirection: "row",
                gap: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  lat : {location.coords.latitude.toFixed(5)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  long : {location.coords.longitude.toFixed(5)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
