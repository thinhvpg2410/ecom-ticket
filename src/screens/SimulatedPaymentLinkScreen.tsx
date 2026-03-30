import React, { useMemo, useState } from "react";
import {
  Alert,
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

import type { RootStackScreenProps } from "../navigation/AppNavigator";
import PrimaryButton from "../components/PrimaryButton";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import { useUserContext } from "../context/UserContext";
import {
  addSimulatedCard,
  addSimulatedMomo,
  addSimulatedVnpay,
} from "../services/paymentMethodsService";

export default function SimulatedPaymentLinkScreen({
  navigation,
  route,
}: RootStackScreenProps<"SimulatedPaymentLinkScreen">) {
  const { kind } = route.params;
  const { currentUser } = useUserContext();

  const title =
    kind === "card"
      ? "Thẻ tín dụng / ghi nợ"
      : kind === "momo"
        ? "Liên kết MoMo"
        : "Liên kết VNPay";

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title={title} onBack={() => navigation.goBack()} />
        <Text style={styles.muted}>Cần đăng nhập.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Header title={title} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {kind === "card" ? (
          <CardForm
            userId={currentUser.id}
            defaultHolder={currentUser.fullName}
            onDone={() => navigation.goBack()}
          />
        ) : kind === "momo" ? (
          <MomoForm userId={currentUser.id} defaultPhone={currentUser.phone} onDone={() => navigation.goBack()} />
        ) : (
          <VnpayForm userId={currentUser.id} onDone={() => navigation.goBack()} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.back} hitSlop={12}>
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

function CardForm({
  userId,
  defaultHolder,
  onDone,
}: {
  userId: string;
  defaultHolder: string;
  onDone: () => void;
}) {
  const [holder, setHolder] = useState(defaultHolder);
  const [last4, setLast4] = useState("");
  const [brand, setBrand] = useState<"VISA" | "MASTERCARD">("VISA");
  const [month, setMonth] = useState("12");
  const [year, setYear] = useState("2028");
  const [loading, setLoading] = useState(false);

  const valid = useMemo(() => {
    return holder.trim().length > 0 && /^\d{4}$/.test(last4.trim());
  }, [holder, last4]);

  const onSave = async () => {
    if (!valid) {
      Alert.alert("Thiếu thông tin", "Nhập tên chủ thẻ và 4 số cuối thẻ.");
      return;
    }
    const m = Number(month);
    const y = Number(year);
    if (m < 1 || m > 12 || y < 2020 || y > 2100) {
      Alert.alert("Hạn thẻ", "Tháng/năm không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      await addSimulatedCard({
        userId,
        holderName: holder,
        last4: last4.trim(),
        brand,
        expiryMonth: m,
        expiryYear: y,
      });
      Alert.alert("Đã lưu", "Phương thức thẻ đã được thêm (mô phỏng).");
      onDone();
    } catch (e) {
      Alert.alert("Lỗi", e instanceof Error ? e.message : "Không lưu được.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Text style={styles.hint}>
        Mô phỏng: không gửi dữ liệu thật tới cổng thanh toán. Chỉ lưu mẫu hiển thị trong hệ thống.
      </Text>

      <Text style={styles.label}>Tên chủ thẻ</Text>
      <TextInput
        value={holder}
        onChangeText={setHolder}
        style={styles.input}
        placeholder="Họ tên in trên thẻ"
        placeholderTextColor={COLORS.placeholder}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>4 số cuối</Text>
      <TextInput
        value={last4}
        onChangeText={(t) => setLast4(t.replace(/\D/g, "").slice(0, 4))}
        style={styles.input}
        placeholder="3611"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="number-pad"
        maxLength={4}
      />

      <Text style={styles.label}>Thương hiệu</Text>
      <View style={styles.row}>
        {(["VISA", "MASTERCARD"] as const).map((b) => (
          <Pressable
            key={b}
            onPress={() => setBrand(b)}
            style={[styles.chip, brand === b && styles.chipOn]}
          >
            <Text style={[styles.chipText, brand === b && styles.chipTextOn]}>{b}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Hết hạn (tháng / năm)</Text>
      <View style={styles.row}>
        <TextInput
          value={month}
          onChangeText={(t) => setMonth(t.replace(/\D/g, "").slice(0, 2))}
          style={[styles.input, styles.half]}
          placeholder="MM"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="number-pad"
          maxLength={2}
        />
        <TextInput
          value={year}
          onChangeText={(t) => setYear(t.replace(/\D/g, "").slice(0, 4))}
          style={[styles.input, styles.half]}
          placeholder="YYYY"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="number-pad"
          maxLength={4}
        />
      </View>

      <PrimaryButton title="Lưu phương thức" onPress={onSave} loading={loading} disabled={!valid || loading} />
    </ScrollView>
  );
}

function MomoForm({
  userId,
  defaultPhone,
  onDone,
}: {
  userId: string;
  defaultPhone: string;
  onDone: () => void;
}) {
  const [phone, setPhone] = useState(defaultPhone.replace(/\s+/g, ""));
  const [loading, setLoading] = useState(false);

  const valid = phone.replace(/\D/g, "").length >= 9;

  const onSave = async () => {
    if (!valid) {
      Alert.alert("Số điện thoại", "Nhập số ví MoMo hợp lệ.");
      return;
    }
    setLoading(true);
    try {
      await addSimulatedMomo({ userId, walletPhone: phone });
      Alert.alert("Đã lưu", "Ví MoMo đã được liên kết (mô phỏng).");
      onDone();
    } catch (e) {
      Alert.alert("Lỗi", e instanceof Error ? e.message : "Không lưu được.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Text style={styles.hint}>
        Mô phỏng liên kết MoMo: chỉ lưu số điện thoại ví để hiển thị, không gọi API MoMo thật.
      </Text>
      <Text style={styles.label}>Số điện thoại MoMo</Text>
      <TextInput
        value={phone}
        onChangeText={(t) => setPhone(t.replace(/\D/g, "").slice(0, 11))}
        style={styles.input}
        placeholder="09xxxxxxxx"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="phone-pad"
      />
      <PrimaryButton title="Xác nhận liên kết" onPress={onSave} loading={loading} disabled={!valid || loading} />
    </ScrollView>
  );
}

function VnpayForm({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setLoading(true);
    try {
      await addSimulatedVnpay({ userId });
      Alert.alert("Đã lưu", "VNPay / ứng dụng ngân hàng đã được thêm (mô phỏng).");
      onDone();
    } catch (e) {
      Alert.alert("Lỗi", e instanceof Error ? e.message : "Không lưu được.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Text style={styles.hint}>
        Mô phỏng: thêm một phương thức VNPay chung. Thanh toán thật sẽ tích hợp sau.
      </Text>
      <PrimaryButton title="Thêm VNPay" onPress={onSave} loading={loading} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  back: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  muted: {
    color: COLORS.mutedText,
    padding: SPACING.lg,
  },
  form: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  hint: {
    color: COLORS.mutedText,
    fontSize: 13,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  label: {
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginBottom: SPACING.md,
    fontSize: 16,
  },
  half: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  chipOn: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(229,9,20,0.12)",
  },
  chipText: {
    color: COLORS.mutedText,
    fontWeight: "800",
  },
  chipTextOn: {
    color: COLORS.text,
  },
});
