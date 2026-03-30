import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/AppNavigator";
import type { Province } from "../data";
import ProvinceCard from "../components/ProvinceCard";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ProvinceListScreen">;

export default function ProvinceListScreen({ route, navigation }: Props) {
  const provinces = route.params.provinces;

  const data = useMemo(() => provinces, [provinces]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
        </Pressable>
        <Text style={styles.title}>Khác</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProvinceCard
            province={item}
            onPress={() =>
              navigation.navigate("ProvinceDetailScreen", {
                provinceId: item.id,
              })
            }
            style={styles.listCard}
            imageStyle={styles.listImage}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnPressed: {
    opacity: 0.85,
  },
  title: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 24,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  listCard: {
    width: "100%",
    height: 170,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  listImage: {
    height: 170,
  },
});

