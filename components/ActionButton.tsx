import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  color?: "primary" | "danger" | "default";
  style?: ViewStyle;
};

export default function ActionButton({
  title,
  onPress,
  disabled = false,
  color = "primary",
  style,
}: Props) {
  let backgroundColor = "#0a84ff";
  if (color === "danger") backgroundColor = "#d12c3c";
  if (color === "default") backgroundColor = "#e0e0e0";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          marginTop: 10,
          backgroundColor,
          paddingVertical: 12,
          borderRadius: 22,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
