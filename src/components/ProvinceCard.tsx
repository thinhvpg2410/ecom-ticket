import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import type { Province } from "../data";
import { COLORS, RADIUS } from "../styles/theme";

export type ProvinceCardProps = {
  province: Province;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function ProvinceCard({
  province,
  onPress,
  style,
  imageStyle,
}: ProvinceCardProps) {
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
      <ImageBackground
        source={{ uri: province.image }}
        style={[styles.image, imageStyle]}
        imageStyle={styles.imageClip}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.nameWrap}>
          <Text style={styles.name} numberOfLines={2}>
            {province.name}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  image: {
    width: "100%",
    height: 150,
  },
  imageClip: {
    borderRadius: RADIUS.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  nameWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
  },
  name: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 14,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
});

