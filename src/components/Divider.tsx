import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../styles/theme";

export default function Divider({ text = "Hoặc" }: { text?: string }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginVertical: SPACING.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  text: {
    color: COLORS.mutedText,
    fontSize: 14,
    fontWeight: "700",
  },
});

