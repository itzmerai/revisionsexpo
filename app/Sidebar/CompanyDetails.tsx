import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import NoNotifHeader from "@/components/NoNotifHeader";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

const CompanyDetails: React.FC = () => {
  const navigation = useNavigation();
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
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
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NoNotifHeader
          title="Company Details"
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
        title="Company Details"
        showBackButton={true}
        onBackPress={handleGoBack}
      />
      <ScrollView style={styles.content}>
        {/* Company Name */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.company_name || "N/A"}
            editable={false}
          />
        </View>

        {/* Company Address */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Company Address</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.company_address || "N/A"}
            editable={false}
          />
        </View>

        {/* Supervisor Name */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Supervisor Name</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.company_mentor || "N/A"}
            editable={false}
          />
        </View>

        {/* Supervisor Contact # */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Supervisor Contact #</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.company_contact || "N/A"}
            editable={false}
          />
        </View>

        {/* Supervisor Email */}
        <View style={styles.detailItem}>
          <Text style={styles.label}>Supervisor Email</Text>
          <TextInput
            style={styles.input}
            value={studentDetails?.company_email || "supervisor@company.com"}
            editable={false}
          />
        </View>

        {/* Company Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About the Company</Text>
          <Text style={styles.descriptionText}>
            {studentDetails?.company_description ||
              "This company is a leading organization in its field, providing excellent opportunities for interns to learn and grow professionally.  With a strong commitment to innovation and employee development, it offers a dynamic work environment that fosters creativity and collaboration."}
          </Text>
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
  detailItem: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: "#0b9ca7",
    marginBottom: 5,
    fontFamily: "MontserratSemiBold",
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
  descriptionContainer: {
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  descriptionTitle: {
    fontSize: 18,
    color: "#0b9ca7",
    marginBottom: 15,
    fontFamily: "MontserratBold",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
});

export default CompanyDetails;
