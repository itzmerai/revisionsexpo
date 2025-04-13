import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Config from "@/config";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import NotificationIcon from "@/components/NotificationIcon";
import { useRouter } from "expo-router";
import Profile from "../Sidebar/Profile";
import Explore from "../Home/Explore";
import FloatingInOutButton from "@/components/FloatingInOutButton";

type HomeScreenRouteProp = RouteProp<
  {
    home: {
      openProfile: () => void;
      setIsProfileVisible: (visible: boolean) => void;
    };
  },
  "home"
>;

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const slideAnim = useRef(new Animated.Value(-300)).current; // Initial position off-screen
  const navigation = useNavigation();
  const route = useRoute<HomeScreenRouteProp>();
  const [isUpdating, setIsUpdating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [announcement, setAnnouncement] = useState({
    type: "",
    content: "",
  });
  const [studentDetails, setStudentDetails] = useState({
    firstName: "N/A",
    renderedTime: 0,
    remainingTime: 0,
    requiredTime: 0,
    studentSex: "N/A",
  });
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const openProfile = () => {
    setIsOverlayVisible(true); // Show overlay
    Animated.timing(slideAnim, {
      toValue: 0, // Slide in to 0 (fully visible)
      duration: 500,
      useNativeDriver: true,
    }).start();
    route.params?.openProfile();
  };

  const closeProfile = () => {
    Animated.timing(slideAnim, {
      toValue: -300, // Slide out to the left
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOverlayVisible(false); // Hide overlay after animation completes
    });
    route.params?.setIsProfileVisible(false);
  };

  const fetchStudentDetails = async () => {
    try {
      setIsUpdating(true);
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) {
        console.error("Student ID not found in AsyncStorage");
        return;
      }

      const response = await fetch(
        `${Config.API_BASE_URL}/api/student-homedetails?student_id=${studentId}`
      );
      const data = await response.json();

      if (response.ok) {
        setStudentDetails((prev) => ({
          ...prev,
          firstName: data.studentDetails.firstName || "N/A",
          renderedTime: data.studentDetails.renderedTime || 0,
          remainingTime: data.studentDetails.remainingTime || 0,
          requiredTime: data.studentDetails.requiredTime || 0,
          studentSex: data.studentDetails.studentSex || "N/A",
        }));
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const tick = () => savedCallback.current?.();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }, [delay]);
  };

  useInterval(fetchStudentDetails, 5000);

  const getProfileImage = () => {
    if (studentDetails.studentSex === "Male") {
      return require("@/assets/images/male.png");
    } else if (studentDetails.studentSex === "Female") {
      return require("@/assets/images/female.png");
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerBackground}>
          <View style={styles.headerr}>
            <TouchableOpacity onPress={openProfile}>
              <Image source={getProfileImage()} style={styles.loggo} />
            </TouchableOpacity>
            <Text style={styles.greetingTextt}>
              Hellooo,{"\n"}
              <Text style={styles.firstNameText}>
                {studentDetails.firstName}! 👋
              </Text>
            </Text>
            <View style={styles.notificationIconContainer}>
              <NotificationIcon />
            </View>
          </View>
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => router.push("/SearchScreen")}
          >
            <Text style={styles.searchPlaceholder}>Search...</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewContainer}>
          <Text style={styles.overviewText}>Overview</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Rendered Time</Text>
              <Text style={styles.timeNumber}>
                {studentDetails.renderedTime}
                <Text style={styles.texthours}> hrs</Text>
              </Text>
              <View style={[styles.colorBar, { backgroundColor: "#0b9ca7" }]} />
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Remaining Time</Text>
              <Text style={styles.timeNumber}>
                {studentDetails.remainingTime}
                <Text style={styles.texthours}> hrs</Text>
              </Text>
              <View style={[styles.colorBar, { backgroundColor: "#0b9ca7" }]} />
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Required Duration</Text>
              <Text style={styles.timeNumber}>
                {studentDetails.requiredTime}
                <Text style={styles.texthours}> hrs</Text>
              </Text>
              <View style={[styles.colorBar, { backgroundColor: "#0b9ca7" }]} />
            </View>
          </ScrollView>

          <ScrollView style={styles.explore}>
            <View style={styles.exploreContainer}>
              <Text style={styles.exploreText}>Explore</Text>
              <Explore />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Overlay */}
      {isOverlayVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeProfile}
        />
      )}

      <Profile slideAnim={slideAnim} onClose={closeProfile} />
      <FloatingInOutButton onPress={() => setModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    backgroundColor: "#0b9ca7",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loggo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingTextt: {
    fontSize: 18,
    color: "#fff",
    flex: 1,
    marginLeft: 10,
    fontFamily: "MontserratRegular",
  },
  firstNameText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 18,
    color: "#fff",
  },
  notificationIconContainer: {
    bottom: 4.2,
    marginLeft: 10,
  },
  searchContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    marginBottom: 7,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  overviewContainer: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 10,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  overviewText: {
    fontSize: 19,
    fontFamily: "MontserratBold",
    color: "#000",
    marginLeft: 5,
  },
  texthours: {
    fontSize: 9,
    fontFamily: "MontserratSemiBold",
  },
  horizontalScroll: {
    flexDirection: "row",
    marginTop: 10,
  },
  timeBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: 135,
    marginHorizontal: 5,
    elevation: 3,
  },
  timeNumber: {
    fontSize: 20,
    fontFamily: "MontserratSemiBold",
    color: "#000",
    top: 6,
  },
  timeLabel: {
    fontSize: 17,
    color: "#000",
    fontFamily: "MontserratRegular",
  },
  colorBar: {
    height: 5,
    width: "100%",
    marginTop: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  exploreContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  exploreText: {
    fontSize: 19,
    fontFamily: "MontserratBold",

    color: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black
    zIndex: 99, // Ensure it's below the profile but above other content
  },
  explore: {
    width: "100%",
  },
});
