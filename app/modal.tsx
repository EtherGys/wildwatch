import { getMarkerByCoords, removeMarker, upsertMarker } from '@/api/api';
import PhotoPickerModal from '@/components/PhotoPickerModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Modal() {
  const params = useLocalSearchParams<{ latitude?: string; longitude?: string }>();
  const navigation = useNavigation();

  const lat = params.latitude ? Number(params.latitude) : undefined;
  const lon = params.longitude ? Number(params.longitude) : undefined;

  const [name, setName] = useState<string>('');
  const [dateISO, setDateISO] = useState<string>(new Date().toISOString().slice(0, 10));
  const [dateText, setDateText] = useState<string>(new Intl.DateTimeFormat('fr-FR').format(new Date()));
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [nameError, setNameError] = useState<string | null>(null);
  const isSaveDisabled = !name.trim();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (typeof lat === 'number' && typeof lon === 'number') {
        const existing = await getMarkerByCoords(lat, lon);
        if (existing) {
          setName(existing.name ?? '');
          const iso = existing.dateISO ?? new Date().toISOString().slice(0, 10);
          setDateISO(iso);
          setDateText(new Intl.DateTimeFormat('fr-FR').format(new Date(iso)));
          setPhotoUri(existing.photoUri);
        }
      }
    })();
  }, [lat, lon]);

  async function pickImageFromLibrary() {
    setShowPhotoPicker(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      setPhotoUri(res.assets[0].uri);
    }
  }

  async function takePhoto() {
    setShowPhotoPicker(false);
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
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
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' }}
      />

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Observation</Text>

            {/* Image avatar: tap to show photo picker modal */}
            <TouchableOpacity onPress={() => setShowPhotoPicker(true)} activeOpacity={0.85}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 16 }} />
              ) : (
                <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#e6e6e6', alignSelf: 'center', marginBottom: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Ajouter une image</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={{ fontWeight: '600', marginBottom: 6 }}>Nom</Text>
            <TextInput
              placeholder="Nom de l'observation"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (nameError && t.trim().length > 0) setNameError(null);
              }}
              style={{ borderColor: nameError ? '#d12c3c' : '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6 }}
            />
            {nameError ? (
              <Text style={{ color: '#d12c3c', fontSize: 12, marginBottom: 8 }}>{nameError}</Text>
            ) : null}

            <Text style={{ fontWeight: '600', marginBottom: 6 }}>Date d'observation</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <TextInput
                pointerEvents="none"
                editable={false}
                placeholder="JJ/MM/AAAA"
                value={dateText}
                style={{ borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, color: '#111' }}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(dateISO)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS !== 'ios') setShowDatePicker(false);
                  if (!selectedDate) return;
                  const y = selectedDate.getFullYear();
                  const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const d = String(selectedDate.getDate()).padStart(2, '0');
                  const iso = `${y}-${m}-${d}`;
                  setDateISO(iso);
                  setDateText(new Intl.DateTimeFormat('fr-FR').format(selectedDate));
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

          <Text style={{ fontWeight: '600', marginBottom: 6 }}>Coordonnées</Text>
          <Text style={{ color: '#333' }}>lat: {lat?.toFixed ? lat.toFixed(6) : '-'}</Text>
          <Text style={{ color: '#333', marginTop: 4 }}>long: {lon?.toFixed ? lon.toFixed(6) : '-'}</Text>

          <TouchableOpacity
            disabled={isSaveDisabled}
            onPress={async () => {
              if (!name.trim()) {
                setNameError('Le nom est requis.');
                return;
              }
              if (typeof lat === 'number' && typeof lon === 'number') {
                await upsertMarker({ latitude: lat, longitude: lon, name: name.trim(), dateISO, photoUri });
                navigation.goBack();
              }
            }}
            style={{ marginTop: 16, backgroundColor: isSaveDisabled ? '#a8c7ff' : '#0a84ff', paddingVertical: 12, borderRadius: 12, opacity: isSaveDisabled ? 0.7 : 1 }}
          >
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '600' }}>Enregistrer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (typeof lat === 'number' && typeof lon === 'number') {
                await removeMarker({ latitude: lat, longitude: lon });
                navigation.goBack();
              }
            }}
            style={{ marginTop: 10, backgroundColor: '#d12c3c', paddingVertical: 12, borderRadius: 12 }}
          >
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '600' }}>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 14, paddingVertical: 10 }}>
            <Text style={{ textAlign: 'center', color: '#222' }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

