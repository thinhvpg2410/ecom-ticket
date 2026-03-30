import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { COLORS, RADIUS } from "../styles/theme";

export type OtherCardProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function OtherCard({ onPress, style }: OtherCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.center}>
        <Text style={styles.text}>Khám phá thêm</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  text: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
  },
});

