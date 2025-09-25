import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PhotoPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => Promise<void>;
  onPickFromLibrary: () => Promise<void>;
}

export default function PhotoPickerModal({
  visible,
  onClose,
  onTakePhoto,
  onPickFromLibrary,
}: PhotoPickerModalProps) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          marginHorizontal: 20,
          borderRadius: 16,
          padding: 20,
          minWidth: 280,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Choisir une photo
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Comment voulez-vous ajouter une photo ?
        </Text>

        <TouchableOpacity
          onPress={onTakePhoto}
          style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#007AFF",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Prendre une photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPickFromLibrary}
          style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#007AFF",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Choisir dans la galerie
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          style={{
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#007AFF",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Annuler
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
