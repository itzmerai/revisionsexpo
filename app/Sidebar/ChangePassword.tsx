import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) {
        throw new Error("Student not found");
      }

      const response = await fetch(
        `${Config.API_BASE_URL}/api/studentchangepass`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password update failed");
      }

      Alert.alert("Success", "Password updated successfully");
      router.push("/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <EvilIcons
          name="chevron-left"
          size={30}
          color="#fff"
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.Screen} activeOpacity={1}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require("@/assets/images/upperlogin.png")}
            style={styles.backgroundImage}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.changepassContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>You can type your new password and</Text>
        <Text style={styles.subtitle}>confirm it below</Text>

        {/* Current Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Current Password"
            placeholderTextColor="#c0c0c0"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Icon
              name={showCurrentPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
            placeholderTextColor="#c0c0c0"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              name={showNewPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#c0c0c0"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f8f7",
  },
  backgroundImage: {
    position: "absolute",
    top: -10,
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 20,
  },
  changepassContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    bottom: "17%",
    minHeight: 430,
    marginTop: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
  passwordContainer: {
    top: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 22,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 0,
    fontFamily: "MontserratRegular",
  },
  title: {
    fontSize: 22,
    fontFamily: "MontserratBold",

    marginBottom: 15,
    textAlign: "center",
    color: "#0b6477",
  },
  subtitle: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
    marginBottom: 1,
    bottom: 6,
    fontFamily: "MontserratRegular",
  },
  Screen: {
    flex: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#0b6477",
    top: "1%",
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 20,
    elevation: 10,
    bottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "MontserratSemiBold",
  },
  welcomeContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  backIcon: {},
});
