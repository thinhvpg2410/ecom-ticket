import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../navigation/AppNavigator";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import Divider from "../components/Divider";
import SocialButton from "../components/SocialButton";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useUserContext } from "../context/UserContext";

export default function SignUpScreen({ navigation }: RootStackScreenProps<"SignUpScreen">) {
  const { register } = useUserContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.trim().length >= 6
    );
  }, [fullName, email, password, phone]);

  const onSignUp = async () => {
    setError(null);
    setSuccess(null);
    if (!isValid) {
      setError("Vui lòng điền đầy đủ thông tin (mật khẩu >= 6 ký tự).");
      return;
    }

    setLoading(true);
    const result = await register({ fullName, email, phone, password });
    setLoading(false);
    if (!result.success) {
      setError(result.message ?? "Đăng ký thất bại.");
      return;
    }

    if (result.needsEmailVerification) {
      setSuccess(result.message ?? "Kiểm tra email để kích hoạt tài khoản.");
      return;
    }

    navigation.replace("MainTabs");
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
            <Text style={styles.title}>ĐĂNG KÝ</Text>

            <InputField
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập tên đầy đủ của bạn"
              autoCapitalize="words"
              textContentType="name"
            />

            <InputField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />

            <InputField
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại của bạn"
              keyboardType="phone-pad"
            />

            <InputField
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu của bạn"
              secureTextEntry
              autoCapitalize="none"
            />

            <PrimaryButton
              title="Đăng ký"
              onPress={onSignUp}
              loading={loading}
              disabled={!isValid || loading}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            <Divider text="Hoặc" />

            <SocialButton
              provider="google"
              text="Đăng ký với Gmail"
              onPress={() => {
                setError("Đăng ký Google chưa được hỗ trợ ở bản cơ bản.");
              }}
            />

            <SocialButton
              provider="facebook"
              text="Đăng ký với Facebook"
              onPress={() => {
                setError("Đăng ký Facebook chưa được hỗ trợ ở bản cơ bản.");
              }}
            />

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Đã có tài khoản?</Text>
              <Pressable onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.bottomLink}>Đăng nhập ngay</Text>
              </Pressable>
            </View>
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
  bottomRow: {
    marginTop: SPACING.lg,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  bottomText: {
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 14,
  },
  bottomLink: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 14,
  },
});

