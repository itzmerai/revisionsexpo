import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
interface ChangePasswordProps {
  onCancel: () => void;
}

export default function ChangePassword({ onCancel }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to toggle password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchCurrentPassword = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        if (!studentId) {
          Alert.alert("Error", "Student ID not found. Please log in again.");
          return;
        }

        const response = await fetch(
          `${Config.API_BASE_URL}/api/student-password?student_id=${studentId}`
        );
        const data = await response.json();

        if (response.ok) {
          setCurrentPassword(data.password); // Set the fetched password
        } else {
          Alert.alert(
            "Error",
            data.error || "Failed to fetch current password."
          );
        }
      } catch (error) {
        console.error("Error fetching current password:", error);
        Alert.alert(
          "Error",
          "An error occurred while fetching current password."
        );
      }
    };

    fetchCurrentPassword();
  }, []);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New Password and Confirm Password do not match.");
      return;
    }

    try {
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) {
        Alert.alert("Error", "Student ID not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${Config.API_BASE_URL}/api/update-student-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password updated successfully.");
        setCurrentPassword(newPassword); // Update currentPassword with the new password
        setNewPassword("");
        setConfirmPassword("");
        onCancel();
      } else {
        Alert.alert("Error", data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onCancel}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Icon */}
        <Icon name="lock" size={80} color="#0066cc" style={styles.icon} />

        {/* Current Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword} // Toggle visibility
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Icon
              name={showCurrentPassword ? "eye" : "eye-slash"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword} // Toggle visibility
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              name={showNewPassword ? "eye" : "eye-slash"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword} // Toggle visibility
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye" : "eye-slash"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Update Password Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "left",
  },
  backButton: {
    position: "absolute",
    top: 2,
    left: 2,
    padding: 10,
  },
  backButtonText: {
    fontSize: 40,
    color: "#000",
  },
  mainContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 5,
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
