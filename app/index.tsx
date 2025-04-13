import { StatusBar } from "react-native";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeLoginScreen from "./WelcomeLoginScreen";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import TabLayout from "./(tabs)/_layout";
import ChangePassword from "@/components/STUDENT/MODAL/ChangePassword";

import { useColorScheme } from "@/hooks/useColorScheme";

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Navigation stack */}
      <Stack.Navigator>
        <Stack.Screen
          name="OJTMS"
          component={WelcomeLoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          component={TabLayout}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
