import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../styles/theme";

export type LogoTextProps = {
  size?: "sm" | "md" | "lg";
};

export default function LogoText({ size = "lg" }: LogoTextProps) {
  const textStyle = styles[size];

  return (
    <View style={styles.row}>
      <Text style={[textStyle, styles.ecom]}>ECOM</Text>
      <Text style={[textStyle, styles.ticket]}>TICKET</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ecom: {
    color: COLORS.text,
    fontWeight: "900",
    letterSpacing: 1,
  },
  ticket: {
    color: COLORS.primary,
    fontWeight: "900",
    letterSpacing: 1,
  },
  lg: { fontSize: 34 },
  md: { fontSize: 26 },
  sm: { fontSize: 18 },
});

