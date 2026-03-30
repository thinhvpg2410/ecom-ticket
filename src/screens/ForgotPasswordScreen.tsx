import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../navigation/AppNavigator";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { requestPasswordReset } from "../services/authService";

export default function ForgotPasswordScreen({
  navigation,
}: RootStackScreenProps<"ForgotPasswordScreen">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => email.trim().length > 0, [email]);

  const onReset = async () => {
    setError(null);
    setSuccess(null);
    if (!isValid) {
      setError("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể gửi email đặt lại mật khẩu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Quên mật khẩu</Text>

            <InputField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />

            <PrimaryButton
              title="Reset password"
              onPress={onReset}
              loading={loading}
              disabled={!isValid || loading}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>
              Quay lại
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: SPACING.lg,
  },
  error: {
    color: "#FF4D4D",
    fontWeight: "700",
    marginTop: SPACING.sm,
  },
  success: {
    color: "#52D273",
    fontWeight: "700",
    marginTop: SPACING.sm,
  },
  back: {
    marginTop: SPACING.lg,
    color: COLORS.primary,
    fontWeight: "900",
    textAlign: "center",
  },
});

