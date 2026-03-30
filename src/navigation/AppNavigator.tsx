import React from "react";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import LaunchScreen from "../screens/LaunchScreen.tsx";
import OnboardingScreen from "../screens/OnboardingScreen.tsx";
import EnterScreen from "../screens/EnterScreen.tsx";
import LoginScreen from "../screens/LoginScreen.tsx";
import SignUpScreen from "../screens/SignUpScreen.tsx";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen.tsx";
import MainTabs from "./BottomTabs.tsx";
import EventDetailScreen from "../screens/EventDetailScreen.tsx";
import ProvinceListScreen from "../screens/ProvinceListScreen.tsx";
import ProvinceDetailScreen from "../screens/ProvinceDetailScreen.tsx";
import type { Province, EventCategory } from "../data";
import EventCategoryScreen from "../screens/EventCategoryScreen.tsx";
import BookingScreen from "../screens/BookingScreen.tsx";
import ETicketScreen from "../screens/ETicketScreen.tsx";
import PaymentScreen from "../screens/PaymentScreen.tsx";
import BookingSuccessScreen from "../screens/BookingSuccessScreen.tsx";
import EditProfileScreen from "../screens/EditProfileScreen.tsx";
import BankLinkScreen from "../screens/BankLinkScreen.tsx";
import SimulatedPaymentLinkScreen from "../screens/SimulatedPaymentLinkScreen.tsx";

export type RootStackParamList = {
  LaunchScreen: undefined;
  OnboardingScreen: undefined;
  EnterScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  MainTabs: undefined;
  EventDetailScreen: { eventId: string };
  ProvinceListScreen: { provinces: Province[] };
  ProvinceDetailScreen: { provinceId: string };
  BookingScreen: { eventId: string; ticketId: string };
  PaymentScreen: { eventId: string; ticketId: string; quantity: number };
  BookingSuccessScreen: {
    eventId: string;
    ticketId: string;
    quantity: number;
    userTicketId?: string;
    orderId?: string;
  };
  ETicketScreen: { ticketId: string };
  EventCategoryScreen: { category: EventCategory; title: string };
  EditProfileScreen: undefined;
  BankLinkScreen: undefined;
  SimulatedPaymentLinkScreen: { kind: "card" | "momo" | "vnpay" };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        <Stack.Screen
          name="LaunchScreen"
          component={LaunchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterScreen"
          component={EnterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetailScreen"
          component={EventDetailScreen}
          options={{ headerShown: true, title: "Chi tiết" }}
        />
        <Stack.Screen
          name="ProvinceListScreen"
          component={ProvinceListScreen}
          options={{ headerShown: false, title: "Khác" }}
        />
        <Stack.Screen
          name="ProvinceDetailScreen"
          component={ProvinceDetailScreen}
          options={{ headerShown: false, title: "Chi tiết" }}
        />
        <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{ headerShown: true, title: "Chọn vé" }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingSuccessScreen"
          component={BookingSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ETicketScreen"
          component={ETicketScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventCategoryScreen"
          component={EventCategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BankLinkScreen"
          component={BankLinkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SimulatedPaymentLinkScreen"
          component={SimulatedPaymentLinkScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

