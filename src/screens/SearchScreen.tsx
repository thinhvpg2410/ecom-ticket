import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import InputField from "../components/InputField";
import { COLORS, SPACING } from "../styles/theme";
import { otherProvinces, type EventCategory } from "../data";

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => [
      "Sân khấu & nghệ thuật",
      "Thể thao",
      "Tham quan & trải nghiệm",
      "Vị trí",
      "Xu hướng",
    ],
    [],
  );

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Tìm kiếm</Text>

        <InputField
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm kiếm"
          keyboardType="default"
          autoCapitalize="none"
          leftIconName="search"
        />

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (item === "Vị trí") {
                  navigation
                    .getParent()
                    ?.navigate("ProvinceListScreen", {
                      provinces: otherProvinces,
                    });
                  return;
                }

                const labelToCategory: Record<string, EventCategory> = {
                  "Xu hướng": "Xu hướng",
                  "Tham quan & trải nghiệm": "Tham quan & trải nghiệm",
                  "Sân khấu & nghệ thuật": "Sân khấu & nghệ thuật",
                  "Thể thao": "Thể thao",
                };

                const mapped = labelToCategory[item];
                if (mapped) {
                  navigation
                    .getParent()
                    ?.navigate("EventCategoryScreen", {
                      category: mapped,
                      title: item,
                    });
                }
              }}
              style={({ pressed }) => [
                styles.categoryRow,
                pressed && styles.categoryPressed,
              ]}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "900" },
  list: { paddingBottom: 90, marginTop: SPACING.lg },
  categoryRow: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryPressed: {
    opacity: 0.9,
  },
  categoryText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 18,
  },
});

