import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS, RADIUS, SPACING } from "../styles/theme";

export type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "solid" | "outline";
};

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "solid",
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "solid" ? styles.solid : styles.outline,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={COLORS.text} />
        ) : (
          <Text style={variant === "solid" ? styles.solidText : styles.outlineText}>
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    marginTop: SPACING.sm,
  },
  solid: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  solidText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});

