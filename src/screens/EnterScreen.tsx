import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../navigation/AppNavigator";
import LogoText from "../components/LogoText";
import PrimaryButton from "../components/PrimaryButton";
import { COLORS, RADIUS, SPACING } from "../styles/theme";

const bgEnter = require("../../assets/bg enter screen.png");

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EnterScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ImageBackground source={bgEnter} style={styles.bg} resizeMode="cover">
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
              title="ĐĂNG NHẬP"
              onPress={() => navigation.navigate("LoginScreen")}
            />
            <PrimaryButton
              title="ĐĂNG KÝ TÀI KHOẢN"
              variant="outline"
              onPress={() => navigation.navigate("SignUpScreen")}
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
    backgroundColor: COLORS.overlay,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  safe: {
    flex: 1,
  },
  cardWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    // backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
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

