import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
export default function CompanyInfo() {
  const [studentDetails, setStudentDetails] = useState(" ");
  const fetchStudentDetails = async () => {
    try {
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) {
        console.error("Student ID not found in AsyncStorage");
        return;
      }

      const response = await fetch(
        `${Config.API_BASE_URL}/api/student-details?student_id=${studentId}`
      );
      const data = await response.json();

      if (response.ok) {
        setStudentDetails(data.studentDetails);
        const newStudentId = data.studentDetails?.student_id;
        if (newStudentId && newStudentId !== studentId) {
          await AsyncStorage.setItem("student_id", newStudentId);
          console.log(
            "AsyncStorage refreshed with new student_id:",
            newStudentId
          );
        }
      } else {
        console.error("Error fetching student details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchStudentDetails();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Company Information</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Company Name:</Text>
        <Text style={styles.value}>{studentDetails.company_name || "N/A"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>
          {studentDetails.company_address || "N/A"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Mentor Name:</Text>
        <Text style={styles.value}>
          {studentDetails.company_mentor || "N/A"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Mentor Contact:</Text>
        <Text style={styles.value}>
          {studentDetails.company_contact || "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontWeight: "normal",
    width: 120,
    color: "#797474",
  },
  value: {
    color: "#000000",
  },
});
