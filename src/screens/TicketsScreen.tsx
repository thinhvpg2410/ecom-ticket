import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import type { MyTicket } from "../data";
import MyTicketCard from "../components/MyTicketCard";
import { COLORS, SPACING } from "../styles/theme";
import { useUserContext } from "../context/UserContext";
import { useMyTickets } from "../hooks/useMyTickets";

type TabKey = "upcoming" | "ended";

export default function TicketsScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useUserContext();
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const { upcomingTickets, endedTickets, loading, error, reload } = useMyTickets();

  useFocusEffect(
    React.useCallback(() => {
      void reload();
    }, [reload]),
  );

  const tickets = useMemo<MyTicket[]>(
    () => {
      if (!currentUser) {
        return [];
      }

      return activeTab === "upcoming" ? upcomingTickets : endedTickets;
    },
    [activeTab, currentUser, endedTickets, upcomingTickets],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Vé của tôi</Text>
      </View>

      <View style={styles.tabs}>
        <TabButton
          active={activeTab === "upcoming"}
          label="Sắp diễn ra"
          onPress={() => setActiveTab("upcoming")}
        />
        <TabButton
          active={activeTab === "ended"}
          label="đã kết thúc"
          onPress={() => setActiveTab("ended")}
        />
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MyTicketCard
            ticket={item}
            onPress={() => navigation.navigate("ETicketScreen", { ticketId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {!currentUser
              ? "Bạn cần đăng nhập để xem vé theo tài khoản."
              : loading
                ? "Đang tải vé của bạn..."
                : error
                  ? error
                  : "Bạn chưa có vé nào."}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  backPressed: { opacity: 0.85 },
  headerTitle: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 26,
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 110,
  },
  emptyText: {
    color: COLORS.mutedText,
    textAlign: "center",
    marginTop: SPACING.xl,
    fontWeight: "700",
  },
});

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        stylesTab.btn,
        pressed && stylesTab.btnPressed,
        active && stylesTab.btnActive,
      ]}
    >
      <Text style={[stylesTab.btnText, active && stylesTab.btnTextActive]}>
        {label}
      </Text>
      {active ? <View style={stylesTab.underline} /> : <View style={stylesTab.underlineHidden} />}
    </Pressable>
  );
}

const stylesTab = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  btnPressed: { opacity: 0.9 },
  btnActive: {},
  btnText: {
    color: COLORS.mutedText,
    fontWeight: "900",
    fontSize: 16,
  },
  btnTextActive: {
    color: COLORS.primary,
  },
  underline: {
    marginTop: 10,
    width: 70,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  underlineHidden: {
    marginTop: 10,
    width: 70,
    height: 3,
    backgroundColor: "transparent",
  },
});

