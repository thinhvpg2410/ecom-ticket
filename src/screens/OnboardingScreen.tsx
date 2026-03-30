import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../navigation/AppNavigator";
import LogoText from "../components/LogoText";
import PrimaryButton from "../components/PrimaryButton";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

const bgLaunch = require("../../assets/bg launch screen.png");

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ImageBackground source={bgLaunch} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.cardWrap}>

            <View style={styles.card}>
              <Image source={require("../../assets/ticket.png")} style={styles.logo} />
              <View style={{position: "static", zIndex: 2,}}>
                <LogoText size="md" />
              </View>

            </View>

          </View>

          <View style={styles.bottom}>
            <PrimaryButton
              title="BẮT ĐẦU"
              onPress={() => navigation.navigate("EnterScreen")}
            />
          </View>
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
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  safe: {
    flex: 1,
  },
  cardWrap: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    // overflow: "hidden",
  },
  logo: {
    position: "absolute",
    top: -20,
    height: 132,
    resizeMode: "contain",
    zIndex: 1,
  },
  bottom: {
    paddingBottom: SPACING.xl,
  },
});

