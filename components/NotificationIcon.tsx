import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text, AppState } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationIcon: React.FC = () => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

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
      
      const newUnreadCount = announcements.filter(
        (ann: any) => !readAnnouncements.includes(ann.id)
      ).length;

      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error("Failed to calculate unread count:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const intervalId = setInterval(() => {
      if (isMounted) calculateUnreadCount();
    }, 3000);

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") calculateUnreadCount();
    });

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      calculateUnreadCount();
    }, [])
  );

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