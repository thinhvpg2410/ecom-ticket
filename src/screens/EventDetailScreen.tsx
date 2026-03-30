import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, RADIUS, SPACING } from "../styles/theme";
import OrganizerCard from "../components/OrganizerCard";
import TicketCard from "../components/TicketCard";
import { useEvents } from "../hooks/useEvents";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetailScreen">;

export default function EventDetailScreen({ route }: Props) {
  const navigation = useNavigation<any>();
  const { events } = useEvents();
  const event = useMemo(
    () => events.find((e) => e.id === route.params.eventId),
    [events, route.params.eventId],
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  const selectedTicket = useMemo(() => {
    if (!event || !selectedTicketId) return null;
    return event.tickets.find((t) => t.id === selectedTicketId) ?? null;
  }, [event, selectedTicketId]);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Không tìm thấy sự kiện.</Text>
      </View>
    );
  }

  const description = event.description;
  const shouldTruncate = description.length > 220;
  const visibleDescription =
    !shouldTruncate || showMore ? description : `${description.slice(0, 220)}...`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.bannerWrap}>
          <Image source={event.image} style={styles.bannerImage} />
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.0)",
              "rgba(0,0,0,0.35)",
              "rgba(0,0,0,0.75)",
            ]}
            style={styles.bannerOverlay}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {event.date}
            {" • "}
            {event.location}
          </Text>
        </View>

        <View style={styles.sectionGap} />

        <OrganizerCard organizer={event.organizer} />

        <View style={styles.sectionGap} />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Mô tả</Text>
          <Text style={styles.desc}>{visibleDescription}</Text>

          {shouldTruncate ? (
            <Pressable
              onPress={() => setShowMore((v) => !v)}
              style={styles.moreBtn}
            >
              <Text style={styles.moreText}>
                {showMore ? "Thu gọn" : "Xem thêm"}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.sectionGap} />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Chọn vé</Text>

          {event.tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              selected={ticket.id === selectedTicketId}
              disabled={ticket.remaining <= 0}
              onPress={() => {
                if (ticket.remaining <= 0) return;
                setSelectedTicketId(ticket.id);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <Pressable
          accessibilityRole="button"
          disabled={!selectedTicket}
          onPress={() => {
            if (!selectedTicket) return;
            navigation.navigate("BookingScreen", {
              eventId: event.id,
              ticketId: selectedTicket.id,
            });
          }}
          style={({ pressed }) => [
            styles.footerBtn,
            !selectedTicket ? styles.footerBtnDisabled : null,
            pressed && selectedTicket ? styles.footerBtnPressed : null,
          ]}
        >
          <Text style={styles.footerBtnText}>Chọn vé</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const FOOTER_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingBottom: FOOTER_HEIGHT + SPACING.xl,
    backgroundColor: COLORS.background,
  },
  bannerWrap: {
    height: 230,
    width: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: 230,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  sectionCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  sectionHeading: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
  },
  title: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 24,
    lineHeight: 30,
  },
  meta: {
    color: COLORS.mutedText,
    fontWeight: "700",
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  desc: {
    color: COLORS.mutedText,
    marginTop: SPACING.sm,
    fontWeight: "700",
    lineHeight: 22,
  },
  moreBtn: {
    marginTop: SPACING.md,
  },
  moreText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 14,
  },
  sectionGap: { height: SPACING.xl },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  error: {
    color: COLORS.mutedText,
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: FOOTER_HEIGHT,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  footerBtn: {
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  footerBtnDisabled: {
    opacity: 0.55,
  },
  footerBtnPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  footerBtnText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
  },
});

