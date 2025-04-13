import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Config from "@/config";
import { router } from "expo-router";

export default function WelcomeLoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGetStarted = () => setIsLogin(true);
  const handleBack = () => {
    setIsLogin(false);
    setUsername("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/api/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_schoolid: username,
          student_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("student_id", String(data.student_id));
        await AsyncStorage.setItem("student_name", data.student_name);
        router.push("/home");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Connection error. Please check your network.");
    }
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <View style={styles.upperContainer}>
            <Image
              source={require("@/assets/images/upperlogin.png")}
              style={styles.backgroundImage}
            />
            <Image
              source={require("@/assets/images/ojt-logowhite.png")}
              style={styles.ojtLogo}
            />
          </View>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-left" size={30} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.title}>Student Login</Text>

            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your School ID"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Integrated On-the-Job Training
              </Text>
              <Text style={styles.footerText}>Monitoring System</Text>
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={require("@/assets/images/front-icon.png")}
              style={styles.logoWelcome}
            />
            <Image
              source={require("@/assets/images/welcomeimage.png")}
              style={styles.fullScreenImage}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f8f7",
  },
  upperContainer: {
    height: "35%",
    backgroundColor: "#0b6477",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.9,
  },
  ojtLogo: {
    width: 350, // Adjust size as needed
    height: 170,
    position: "absolute",
    top: "5%", // Adjust positioning to ensure it appears above welcomeimage
    zIndex: 2,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  loginContainer: {
    position: "absolute",
    top: "25%",
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    color: "#0b6477",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "MontserratBold",
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
    marginLeft: 5,

    fontFamily: "MontserratRegular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: "#333",
    fontFamily: "MontserratRegular",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#0b6477",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",

    textAlign: "center",
  },
  footerContainer: {
    marginTop: 40,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
    fontFamily: "MontserratRegular",
  },
  fullScreenButton: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWelcome: {
    width: 125,
    height: 230,
    position: "absolute",
    top: "36%",
    zIndex: 1,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
