import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Text,
  View,
  TouchableHighlight,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../config"; // Ensure this is set correctly

const FloatingInOutButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => {
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const scaleValue = new Animated.Value(1);
  const rotateValue = new Animated.Value(0);
  const floatValue = new Animated.Value(0);

  // Fetch Student ID when component mounts
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const storedId = await AsyncStorage.getItem("student_id");
        if (storedId) {
          setStudentId(storedId);

          // Load timer state for this student
          const timerState = await AsyncStorage.getItem(
            `timerState_${storedId}`
          );
          setIsTimerOn(timerState === "true");
        }
      } catch (error) {
        console.error("Error loading initial state:", error);
      }
    };

    loadInitialState();
  }, []);
  useEffect(() => {
    const saveTimerState = async () => {
      if (studentId) {
        try {
          await AsyncStorage.setItem(
            `timerState_${studentId}`,
            isTimerOn.toString()
          );
        } catch (error) {
          console.error("Error saving timer state:", error);
        }
      }
    };

    saveTimerState();
  }, [isTimerOn, studentId]);

  // Rotating Gradient Animation
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotateValue]);

  // Floating Animation
  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [floatValue]);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      // Request location permissions
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        setIsModalVisible(false);
        return;
      }

      // Get user's current location
      const location = await getCurrentPositionAsync({});
      if (!location || !location.coords) {
        console.error("Failed to retrieve location");
        return;
      }

      const { latitude, longitude } = location.coords;
      console.log("User Location:", latitude, longitude);

      if (!studentId) {
        console.error("Student ID not found.");
        return;
      }

      // Send data to backend
      const response = await axios.post(`${Config.API_BASE_URL}/student/time`, {
        studentId: studentId,
        scanTime: new Date().toISOString(),
        address: `${latitude}, ${longitude}`,
      });

      console.log("Server Response:", response.data);

      // Toggle the timer state
      setIsTimerOn((prev) => !prev);

      // Trigger scaling animation
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setIsModalVisible(false);
      onPress(); // Call parent function if needed
    } catch (error) {
      console.error("Error getting location or sending data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const floatInterpolation = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  return (
    <>
      {/* Floating Button */}
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          { transform: [{ translateY: floatInterpolation }] },
        ]}
      >
        <Animated.View
          style={[
            styles.gradientOutline,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        >
          <View style={styles.gradient} />
        </Animated.View>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            {isTimerOn ? (
              <MaterialIcons name="timer-off" size={40} color="#FF9999" />
            ) : (
              <MaterialIcons name="timer" size={40} color="#ffffff" />
            )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {isTimerOn
                ? "Are you sure you want to time out?"
                : "Are you sure you want to time in?"}
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableHighlight
                style={[styles.modalButton, styles.yesButton]}
                onPress={handleConfirm}
                underlayColor="#DDDDDD"
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.modalButton, styles.noButton]}
                onPress={handleCancel}
                underlayColor="#DDDDDD"
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Add your styles here
const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    top: 560,
    right: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientOutline: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#0b9ca7",
    position: "absolute",
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "transparent",
  },
  floatingButton: {
    width: 70, // Adjust based on icon size
    height: 70,
    borderRadius: 35,
    backgroundColor: "#0b9ca7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "rgba(232, 223, 223, 0.95)",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  yesButton: {
    backgroundColor: "#0b9ca7",
  },
  noButton: {
    backgroundColor: "#a9a9a9",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
  },
});

export default FloatingInOutButton;
