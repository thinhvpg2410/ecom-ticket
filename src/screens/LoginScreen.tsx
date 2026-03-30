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

type Props = RootStackScreenProps<"LoginScreen">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useUserContext();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return emailOrPhone.trim().length > 0 && password.trim().length > 0;
  }, [emailOrPhone, password]);

  const onLogin = async () => {
    setError(null);
    if (!isValid) {
      setError("Vui lòng nhập đầy đủ email/điện thoại và mật khẩu.");
      return;
    }

    setLoading(true);
    let result: Awaited<ReturnType<typeof login>>;
    try {
      result = await login(emailOrPhone, password);
    } finally {
      setLoading(false);
    }

    if (!result.success) {
      setError(result.message ?? "Đăng nhập thất bại.");
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
            <Text style={styles.title}>ĐĂNG NHẬP</Text>

            <InputField
              label="Email hoặc số điện thoại"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              placeholder="Nhập ở đây"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />

            <InputField
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text style={styles.forgot}>Quên mật khẩu?</Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              title="ĐĂNG NHẬP"
              onPress={onLogin}
              loading={loading}
              disabled={!isValid || loading}
            />
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Chưa có tài khoản?</Text>
              <Pressable onPress={() => navigation.navigate("SignUpScreen")}>
                <Text style={styles.bottomLink}>Đăng ký ngay</Text>
              </Pressable>
            </View>

            <Divider text="Hoặc" />

            <SocialButton
              provider="google"
              text="Đăng nhập bằng Google"
              onPress={() => {
                setError("Đăng nhập Google chưa được hỗ trợ ở bản cơ bản.");
              }}
            />

            <SocialButton
              provider="facebook"
              text="Đăng nhập bằng Facebook"
              onPress={() => {
                setError("Đăng nhập Facebook chưa được hỗ trợ ở bản cơ bản.");
              }}
            />
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
  forgot: {
    color: COLORS.primary,
    fontWeight: "800",
    textAlign: "left",
    marginTop: -4,
    marginBottom: SPACING.sm,
  },
  error: {
    color: "#FF4D4D",
    fontWeight: "700",
    marginBottom: SPACING.sm,
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

