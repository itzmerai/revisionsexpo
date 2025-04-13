import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

const NotificationIcon: React.FC = () => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSampleBadge, setShowSampleBadge] = useState(true); // Added for testing

  useEffect(() => {
    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        if (!studentId) return;

        const response = await fetch(
          `${Config.API_BASE_URL}/api/unread-announcements-count?student_id=${studentId}`
        );
        const data = await response.json();

        if (response.ok && isMounted) {
          setUnreadCount(data.count || 0);
          // Hide sample badge if we have real unread notifications
          if (data.count > 0) {
            setShowSampleBadge(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleNotificationPress = () => {
    // Clear both real and sample badges when clicked
    setUnreadCount(0);
    setShowSampleBadge(false);
    router.push("/NotificationScreen");
  };

  // For testing: Remove this useEffect in production
  useEffect(() => {
    // Show sample badge for 5 seconds when component mounts
    const timer = setTimeout(() => {
      setShowSampleBadge(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      onPress={handleNotificationPress}
      style={styles.container}
      testID="notification-icon"
    >
      <Ionicons
        name="notifications-outline"
        size={24}
        color="#fff"
        style={styles.notificationIcon}
      />
      {(unreadCount > 0 || showSampleBadge) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : "1"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  notificationIcon: {
    marginLeft: 10,
    marginHorizontal: 5,
  },
  badge: {
    position: "absolute",
    right: 3,
    top: -7,
    backgroundColor: "#FF5252",
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default NotificationIcon;
