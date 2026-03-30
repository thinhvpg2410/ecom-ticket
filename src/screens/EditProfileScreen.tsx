import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import { useUserContext } from "../context/UserContext";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import PrimaryButton from "../components/PrimaryButton";

function isValidBirthDate(value: string) {
  if (!value.trim()) {
    return true;
  }
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim());
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function EditProfileScreen({
  navigation,
}: RootStackScreenProps<"EditProfileScreen">) {
  const { currentUser, updateProfile } = useUserContext();
  const placeholderAvatar = require("../../assets/ticket.png");

  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [email] = useState(currentUser?.email ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth ?? "");
  const [avatarFileUri, setAvatarFileUri] = useState<string | undefined>(undefined);
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const previewUri = avatarFileUri ?? currentUser?.avatarUrl;

  const formValid = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      phone.trim().length >= 8 &&
      isValidBirthDate(dateOfBirth)
    );
  }, [dateOfBirth, fullName, phone]);

  const onPickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Quyền truy cập bị từ chối", "Vui lòng cấp quyền thư viện ảnh để đổi avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }
    setAvatarFileUri(result.assets[0].uri);
    setAvatarBase64(result.assets[0].base64 ?? undefined);
  };

  const onSave = async () => {
    if (!formValid) {
      Alert.alert("Thông tin chưa hợp lệ", "Kiểm tra lại họ tên, số điện thoại và ngày sinh.");
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      fullName,
      phone,
      dateOfBirth,
      avatarFileUri,
      avatarBase64,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert("Cập nhật thất bại", result.message ?? "Vui lòng thử lại.");
      return;
    }

    Alert.alert("Thành công", "Hồ sơ của bạn đã được cập nhật.");
    navigation.goBack();
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>CHỈNH SỬA HỒ SƠ</Text>
          </View>

          <View style={styles.avatarWrap}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Image
                  source={previewUri ? { uri: previewUri } : placeholderAvatar}
                  style={styles.avatar}
                />
              </View>
            </View>
            <Pressable onPress={onPickAvatar} style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Thay đổi ảnh</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Nhập họ và tên"
              placeholderTextColor={COLORS.placeholder}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              value={email}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
              placeholderTextColor={COLORS.placeholder}
            />

            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Ngày sinh:</Text>
            <TextInput
              value={dateOfBirth}
              onChangeText={(text) => setDateOfBirth(formatBirthDateInput(text))}
              style={styles.input}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="numeric"
            />

            <PrimaryButton
              title="Lưu thay đổi"
              onPress={onSave}
              loading={loading}
              disabled={!formValid || loading}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#090D15",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarOuter: {
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 8,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: "hidden",
    backgroundColor: COLORS.card,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  changeAvatarButton: {
    marginTop: SPACING.sm,
    backgroundColor: "#4A4A4A",
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  changeAvatarText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
  },
  form: {
    marginTop: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    fontSize: 32,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginBottom: SPACING.md,
  },
  inputDisabled: {
    opacity: 0.7,
  },
});
