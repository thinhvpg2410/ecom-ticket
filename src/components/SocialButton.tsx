import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { COLORS, RADIUS } from "../styles/theme";

export type SocialProvider = "google" | "facebook";

export type SocialButtonProps = {
  provider: SocialProvider;
  text: string;
  onPress?: () => void;
};

const providerIcon: Record<SocialProvider, keyof typeof FontAwesome.glyphMap> =
  {
    google: "google",
    facebook: "facebook",
  };

export default function SocialButton({
  provider,
  text,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <FontAwesome
            name={providerIcon[provider]}
            size={18}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    marginTop: 12,
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 14,
  },
  iconWrap: {
    position: "absolute",
    left: 14,
    width: 26,
    alignItems: "center",
  },
  text: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
  },
});

