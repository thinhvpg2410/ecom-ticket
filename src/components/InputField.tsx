import React, { useMemo, useState } from "react";
import {
  type TextStyle,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, RADIUS, SPACING } from "../styles/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

export type InputFieldProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  leftIconName?: IoniconName;
  leftIconColor?: string;
  leftIconSize?: number;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  textContentType?: TextInputProps["textContentType"];
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  leftIconName,
  leftIconColor = COLORS.primary,
  leftIconSize = 18,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  textContentType,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const containerStyle = useMemo(
    () => [styles.container, focused && styles.containerFocused],
    [focused],
  );

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={containerStyle}>
        {!!leftIconName ? (
          <View style={styles.iconWrap}>
            <Ionicons
              name={leftIconName}
              size={leftIconSize}
              color={leftIconColor}
            />
          </View>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, !!leftIconName && styles.inputWithIcon]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: SPACING.xs,
    fontWeight: "700",
  },
  container: {
    backgroundColor: COLORS.input,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  containerFocused: {
    borderColor: COLORS.primary,
  },
  input: {
    color: COLORS.text,
    fontSize: 16,
    padding: 0,
  },
  inputWithIcon: {
    flex: 1,
  },
  iconWrap: {
    marginRight: SPACING.sm,
  },
});

