import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationIcon: React.FC = () => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const calculateUnreadCount = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        if (!studentId) return;

        const [announcementsData, readAnnouncementsData] = await Promise.all([
          AsyncStorage.getItem(`announcements_${studentId}`),
          AsyncStorage.getItem(`readAnnouncements_${studentId}`),
        ]);

        const announcements = announcementsData ? JSON.parse(announcementsData) : [];
        const readAnnouncements = readAnnouncementsData ? JSON.parse(readAnnouncementsData) : [];
        
        // Calculate unread count by checking which announcements haven't been read
        interface Announcement {
          id: string;
          [key: string]: any; // Adjust fields as per your actual data structure
        }

        const newUnreadCount = announcements.filter(
          (ann: Announcement) => !readAnnouncements.includes(ann.id)
        ).length;

        if (isMounted) {
          setUnreadCount(newUnreadCount);
        }
      } catch (error) {
        console.error("Failed to calculate unread count:", error);
      }
    };

    // Initial calculation
    calculateUnreadCount();

    // Set up polling every 30 seconds
    const intervalId = setInterval(calculateUnreadCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleNotificationPress = () => {
    router.push("/NotificationScreen");
  };

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
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
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
