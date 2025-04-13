import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import NoNotifHeader from "@/components/NoNotifHeader";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

const Details: React.FC = () => {
  const navigation = useNavigation();
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        if (!studentId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${Config.API_BASE_URL}/api/student-details?student_id=${studentId}`
        );
        const data = await response.json();

        if (data.studentDetails) {
          setStudentDetails(data.studentDetails);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const getProfileImage = () => {
    if (studentDetails?.student_sex === "Male") {
      return require("@/assets/images/male.png");
    } else if (studentDetails?.student_sex === "Female") {
      return require("@/assets/images/female.png");
    }
    return require("@/assets/images/profilesample.png");
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NoNotifHeader
          title="Student Details"
          showBackButton={true}
          onBackPress={handleGoBack}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b9ca7" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NoNotifHeader
        title="Student Details"
        showBackButton={true}
        onBackPress={handleGoBack}
      />
      <ScrollView style={styles.content}>
        {/* Profile Image */}
        <View style={styles.header}>
          <Image source={getProfileImage()} style={styles.profileImage} />
        </View>

        {/* Full Name */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.student_name || "N/A"}
            editable={false}
          />
        </View>

        {/* School ID and Gender */}
        <View style={styles.rowContainer}>
          <View style={[styles.detailItem, styles.flexHalf]}>
            <Text style={styles.label}>School ID</Text>
            <TextInput
              style={styles.input}
              value={studentDetails?.student_schoolid || "N/A"}
              editable={false}
            />
          </View>
          <View style={[styles.detailItem, styles.flexHalf]}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              value={studentDetails?.student_sex || "N/A"}
              editable={false}
            />
          </View>
        </View>

        {/* Contact Number */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.student_contact || "N/A"}
            editable={false}
          />
        </View>

        {/* Address */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.student_address || "N/A"}
            editable={false}
          />
        </View>

        {/* Email */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.student_email || "N/A"}
            editable={false}
          />
        </View>

        {/* Program */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Program</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.program_name || "N/A"}
            editable={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  detailItem: {
    marginBottom: 18,
    top: 2,
  },
  label: {
    fontSize: 16,
    color: "#0b9ca7",
    marginBottom: 5,
    fontFamily: "MontserratBold",
  },
  input: {
    fontSize: 16,
    color: "#666",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
    fontFamily: "MontserratRegular",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexHalf: {
    flex: 0.48,
  },
});

export default Details;
