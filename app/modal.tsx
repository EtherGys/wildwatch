import { getMarkerByCoords, removeMarker, upsertMarker } from "@/api/api";
import ActionButton from "@/components/ActionButton";
import LabelInput from "@/components/LabelInput";
import PhotoPickerModal from "@/components/PhotoPickerModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Modal() {
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
  }>();
  const navigation = useNavigation();

  const lat = params.latitude ? Number(params.latitude) : undefined;
  const lon = params.longitude ? Number(params.longitude) : undefined;

  const [name, setName] = useState<string>("");
  const [dateISO, setDateISO] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [dateText, setDateText] = useState<string>(
    new Intl.DateTimeFormat("fr-FR").format(new Date())
  );
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [nameError, setNameError] = useState<string | null>(null);
  const isSaveDisabled = !name.trim();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof lat === "number" && typeof lon === "number") {
        const existing = await getMarkerByCoords(lat, lon);
        if (existing) {
          setEdit(true);
          setName(existing.name ?? "");
          const iso = existing.dateISO ?? new Date().toISOString().slice(0, 10);
          setDateISO(iso);
          setDateText(new Intl.DateTimeFormat("fr-FR").format(new Date(iso)));
          setPhotoUri(existing.photoUri);
        }
      }
    })();
  }, [lat, lon]);

  async function pickImageFromLibrary() {
    setShowPhotoPicker(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setPhotoUri(res.assets[0].uri);
    }
  }

  async function takePhoto() {
    setShowPhotoPicker(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setPhotoUri(res.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: "#fff",
            margin: 12,
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            {edit ? "Ajouter une" : "Créer une "} observation
          </Text>

          {/* Image */}
          <TouchableOpacity
            onPress={() => setShowPhotoPicker(true)}
            activeOpacity={0.85}
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  alignSelf: "center",
                  marginBottom: 16,
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#e6e6e6",
                  alignSelf: "center",
                  marginBottom: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 22, color: "gray", fontWeight: "700" }}
                >
                  + Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <LabelInput
            label="Nom"
            value={name}
            onChange={(t) => {
              setName(t);
              if (nameError && t.trim().length > 0) setNameError(null);
            }}
            placeholder="Nom de l'observation"
            error={nameError}
          />

          <LabelInput
            label="Date d'observation"
            value={dateText}
            onPress={() => setShowDatePicker(true)}
            placeholder="JJ/MM/AAAA"
            editable={false}
          />

          {showDatePicker && (
            <DateTimePicker
              value={new Date(dateISO)}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                if (Platform.OS !== "ios") setShowDatePicker(false);
                if (!selectedDate) return;
                const y = selectedDate.getFullYear();
                const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
                const d = String(selectedDate.getDate()).padStart(2, "0");
                const iso = `${y}-${m}-${d}`;
                setDateISO(iso);
                setDateText(
                  new Intl.DateTimeFormat("fr-FR").format(selectedDate)
                );
              }}
              maximumDate={new Date()}
            />
          )}

          {/* Photo picker modal */}
          <PhotoPickerModal
            visible={showPhotoPicker}
            onClose={() => setShowPhotoPicker(false)}
            onTakePhoto={takePhoto}
            onPickFromLibrary={pickImageFromLibrary}
          />

          <ActionButton
            title="Enregistrer"
            onPress={async () => {
              if (!name.trim()) {
                setNameError("Le nom est requis.");
                return;
              }
              if (typeof lat === "number" && typeof lon === "number") {
                await upsertMarker({
                  latitude: lat,
                  longitude: lon,
                  name: name.trim(),
                  dateISO,
                  photoUri,
                });
                navigation.goBack();
              }
            }}
            disabled={isSaveDisabled}
            color="primary"
          />
          {edit && (
            <ActionButton
              title="Supprimer"
              onPress={async () => {
                if (typeof lat === "number" && typeof lon === "number") {
                  await removeMarker({ latitude: lat, longitude: lon });
                  navigation.goBack();
                }
              }}
              color="danger"
            />
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 14, paddingVertical: 10 }}
          >
            <Text style={{ textAlign: "center", color: "#222" }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
