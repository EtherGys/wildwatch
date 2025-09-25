import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  error?: string | null;
  onPress?: () => void;
  editable?: boolean;
};

export default function LabelInput({
  label,
  value,
  placeholder,
  onChange,
  error,
  onPress,
  editable = true,
}: Props) {
  const input = (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChange}
      editable={editable && !onPress}
      style={[
        styles.input,
        { borderColor: error ? "#d12c3c" : "#ddd" },
        !editable || onPress ? styles.readonly : {},
      ]}
      pointerEvents={onPress ? "none" : "auto"}
    />
  );

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      {onPress ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
          {input}
        </TouchableOpacity>
      ) : (
        input
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111",
  },
  error: {
    color: "#d12c3c",
    fontSize: 12,
    marginTop: 4,
  },
  readonly: {
    backgroundColor: "#f4f4f4",
  },
});
