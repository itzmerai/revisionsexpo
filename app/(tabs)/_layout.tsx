import { Tabs } from "expo-router";
import React, { useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TabBar from "@/components/TabBar";
import Profile from "../Sidebar/Profile";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    MontserratRegular: Montserrat_400Regular,
    MontserratSemiBold: Montserrat_600SemiBold,
    MontserratBold: Montserrat_700Bold,
  });

  const openProfile = () => setIsProfileVisible(true);
  const closeProfile = () => setIsProfileVisible(false);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <TabBar {...props} isProfileVisible={isProfileVisible} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color || "white"} />
            ),
          }}
          listeners={{
            tabPress: () => closeProfile(),
          }}
          initialParams={{ openProfile, setIsProfileVisible }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            title: "Upload",
            tabBarIcon: ({ color }) => (
              <AntDesign
                name="clouduploado"
                size={24}
                color={color || "white"}
              />
            ),
          }}
          listeners={{
            tabPress: () => closeProfile(),
          }}
        />
        <Tabs.Screen
          name="dtr"
          options={{
            title: "DTR",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-clock-outline"
                size={24}
                color={color || "white"}
              />
            ),
          }}
          listeners={{
            tabPress: () => closeProfile(),
          }}
        />
      </Tabs>
    </>
  );
}
