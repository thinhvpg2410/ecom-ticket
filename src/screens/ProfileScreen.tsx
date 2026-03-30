import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SPACING } from "../styles/theme";
import { useUserContext } from "../context/UserContext";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { currentUser, logout } = useUserContext();
  const placeholderAvatar = require("../../assets/ticket.png");
  const avatarSource = currentUser?.avatarUrl
    ? { uri: currentUser.avatarUrl }
    : placeholderAvatar;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>HỒ SƠ</Text>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Image source={avatarSource} style={styles.avatar} />
            </View>
          </View>
        </View>

        <Text style={styles.name}>
          {currentUser?.fullName ?? "Bạn chưa đăng nhập"}
        </Text>
        {currentUser ? (
          <>
            <Text style={styles.meta}>Email: {currentUser.email}</Text>
            <Text style={styles.meta}>SĐT: {currentUser.phone}</Text>
            <Text style={styles.meta}>Mã user: {currentUser.id}</Text>
          </>
        ) : (
          <Text style={styles.meta}>Vui lòng đăng nhập để xem trang hồ sơ riêng.</Text>
        )}

        <View style={styles.divider} />

        <View style={styles.actions}>
          <MenuButton
            icon="create-outline"
            title="Chỉnh sửa hồ sơ"
            onPress={() => navigation.navigate("EditProfileScreen")}
          />
          <MenuButton
            icon="card-outline"
            title="Liên kết hình thức thanh toán"
            onPress={() => navigation.navigate("BankLinkScreen")}
          />
          <MenuButton
            icon="time-outline"
            title="Lịch sử mua hàng"
            onPress={() => {}}
          />
          <MenuButton
            icon="document-text-outline"
            title="Điều khoản dịch vụ"
            onPress={() => {}}
          />
          <MenuButton
            icon="log-out-outline"
            title="Đăng xuất"
            onPress={async () => {
              await logout();
              navigation.replace("LoginScreen");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenuButton({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <View style={styles.btnInner}>
        <Ionicons name={icon} size={18} color={COLORS.text} />
        <Text style={styles.btnText}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: 90,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  avatarOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: COLORS.card,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: SPACING.lg,
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
    textAlign: "center",
  },
  meta: {
    marginTop: 6,
    color: COLORS.mutedText,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    marginTop: SPACING.lg,
    height: 1,
    backgroundColor: COLORS.border,
  },
  actions: {
    marginTop: SPACING.xl,
    gap: 14,
  },
  btn: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
  },
  btnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    flex: 1,
  },
});

