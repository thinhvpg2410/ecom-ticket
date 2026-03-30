import React, { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../navigation/AppNavigator";
import LogoText from "../components/LogoText";
import { COLORS, SPACING } from "../styles/theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserContext } from "../context/UserContext";

const bgLaunch = require("../../assets/bg launch screen.png");

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LaunchScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser, authReady } = useUserContext();

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const nextRoute = currentUser ? "MainTabs" : "OnboardingScreen";
    const t = setTimeout(() => navigation.replace(nextRoute), 1000);
    return () => clearTimeout(t);
  }, [authReady, currentUser, navigation]);

  return (
    <ImageBackground source={bgLaunch} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <LogoText />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  safe: {
    flex: 1,
  },
});

