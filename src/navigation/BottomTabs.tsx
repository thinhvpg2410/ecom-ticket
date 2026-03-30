import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../styles/theme";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import TicketsScreen from "../screens/TicketsScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Tickets: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.mutedText,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === "Home"
              ? "home-outline"
              : route.name === "Search"
                ? "search-outline"
                : route.name === "Tickets"
                  ? "ticket-outline"
                  : "person-outline";

          return (
            <Ionicons
              name={iconName as any}
              size={size}
              color={color}
              style={styles.icon}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Tìm kiếm" }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{ title: "Vé của tôi" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Hồ sơ" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0A0A0A",
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    paddingBottom: SPACING.sm,
    height: 70,
  },
  tabLabel: {
    fontWeight: "800",
    paddingBottom: 2,
  },
  icon: {
    marginTop: 2,
  },
});

// If you later want to navigate from tabs to root stack screens,
// you can type `useNavigation<NativeStackNavigationProp<RootStackParamList>>()`.
export type MainTabsScreenProps<T extends keyof MainTabsParamList> =
  BottomTabScreenProps<MainTabsParamList, T>;

