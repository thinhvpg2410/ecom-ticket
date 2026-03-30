import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import type { PaymentMethod } from "../mockData";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useUserContext } from "../context/UserContext";
import { listPaymentMethodsForUser } from "../services/paymentMethodsService";

export default function BankLinkScreen({ navigation }: RootStackScreenProps<"BankLinkScreen">) {
  const { currentUser } = useUserContext();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!currentUser) {
      setMethods([]);
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const list = await listPaymentMethodsForUser(currentUser.id);
      setMethods(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được phương thức thanh toán.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={styles.muted}>Vui lòng đăng nhập để liên kết ngân hàng.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Header onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Thẻ đã liên kết</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : error ? (
          <Text style={styles.err}>{error}</Text>
        ) : methods.length === 0 ? (
          <Text style={styles.muted}>Chưa có phương thức nào. Thêm mới bên dưới.</Text>
        ) : (
          <View style={styles.cardList}>
            {methods.map((m) => (
              <LinkedMethodCard key={m.id} method={m} />
            ))}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate("SimulatedPaymentLinkScreen", { kind: "card" })}
        >
          <Text style={styles.addBtnText}>+ THÊM PHƯƠNG THỨC THANH TOÁN MỚI</Text>
        </Pressable>

        <View style={styles.optionsBox}>
          <OptionRow
            icon="card-outline"
            title="Thẻ tín dụng/ thẻ ghi nợ"
            onPress={() => navigation.navigate("SimulatedPaymentLinkScreen", { kind: "card" })}
          />
          <View style={styles.sep} />
          <OptionRow
            icon="phone-portrait-outline"
            title="Ví MoMo"
            titleStyle={styles.titleMomo}
            onPress={() => navigation.navigate("SimulatedPaymentLinkScreen", { kind: "momo" })}
          />
          <View style={styles.sep} />
          <OptionRow
            icon="business-outline"
            title="VN Pay/ ứng dụng ngân hàng"
            titleStyle={styles.titleVnpay}
            onPress={() => navigation.navigate("SimulatedPaymentLinkScreen", { kind: "vnpay" })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.back} hitSlop={12}>
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </Pressable>
      <Text style={styles.headerTitle}>LIÊN KẾT NGÂN HÀNG</Text>
    </View>
  );
}

function LinkedMethodCard({ method }: { method: PaymentMethod }) {
  if (method.type === "momo") {
    return (
      <View style={styles.bankCard}>
        <View style={styles.bankCardTop}>
          <Text style={styles.momoBadge}>MoMo</Text>
          <Text style={styles.cardBrand}>Ví</Text>
        </View>
        <Text style={styles.cardNumber}>•••• {method.walletPhone?.slice(-4) ?? "----"}</Text>
        <Text style={styles.cardName}>{method.providerLabel}</Text>
      </View>
    );
  }

  if (method.type === "vnpay") {
    return (
      <View style={styles.bankCard}>
        <View style={styles.bankCardTop}>
          <Text style={styles.vnpayBadge}>VNPay</Text>
        </View>
        <Text style={styles.cardNumber}>{method.providerLabel}</Text>
      </View>
    );
  }

  return (
    <View style={styles.bankCard}>
      <View style={styles.bankCardTop}>
        <View style={styles.mcCircles}>
          <View style={[styles.mcDot, { backgroundColor: "#EB001B" }]} />
          <View style={[styles.mcDot, { backgroundColor: "#F79E1B", marginLeft: -6 }]} />
        </View>
        <Text style={styles.cardBrand}>{method.brand ?? "VISA"}</Text>
      </View>
      <Text style={styles.cardNumber}>****{method.last4 ?? "----"}</Text>
      <Text style={styles.cardName}>{(method.holderName ?? "").toUpperCase() || "CHỦ THẺ"}</Text>
    </View>
  );
}

function OptionRow({
  icon,
  title,
  titleStyle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  titleStyle?: TextStyle;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.optionRow, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={COLORS.mutedText} />
      <Text style={[styles.optionText, titleStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  back: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  center: {
    paddingVertical: SPACING.xl,
    alignItems: "center",
  },
  muted: {
    color: COLORS.mutedText,
    fontWeight: "600",
  },
  err: {
    color: "#FF6B6B",
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  cardList: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bankCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  mcCircles: {
    flexDirection: "row",
    alignItems: "center",
  },
  mcDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  cardBrand: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 2,
  },
  cardNumber: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  cardName: {
    color: COLORS.mutedText,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  momoBadge: {
    color: "#EC4899",
    fontWeight: "900",
    fontSize: 18,
  },
  vnpayBadge: {
    color: "#0E4B99",
    fontWeight: "900",
    fontSize: 18,
  },
  titleMomo: {
    color: "#EC4899",
  },
  titleVnpay: {
    color: "#5B8FD8",
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  addBtnText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.92,
  },
  optionsBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  optionText: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
});
