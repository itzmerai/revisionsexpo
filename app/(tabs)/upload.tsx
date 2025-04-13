import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import FileTable from "@/components/STUDENT/FileTable";
import AddReportModal from "@/components/STUDENT/AddReportModal";
import { useNavigation } from "@react-navigation/native";
import Header from "@/components/Header";
import FloatingAddButton from "@/components/FloatingAddButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

interface Document {
  document_id: string;
  date_uploaded: string;
  remarks: string;
  uploaded_file: string;
}

export default function UploadScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) throw new Error("Student ID not found");

      const response = await fetch(
        `${Config.API_BASE_URL}/documents?student_id=${studentId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReport = (remarks: string, fileUri: string | null) => {
    if (fileUri) {
      // Optimistically add to UI while refetching
      fetchDocuments();
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Upload Files"
        showBackButton={true}
        onBackPress={handleGoBack}
      />

      <View style={styles.mainContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0b9ca7" />
            <Text style={styles.loadingText}>Loading uploaded files...</Text>
          </View>
        ) : reports.length > 0 ? (
          <FileTable data={reports} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No files found</Text>
          </View>
        )}
      </View>

      <AddReportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddReport={handleAddReport}
      />

      <FloatingAddButton onPress={() => setModalVisible(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 150,
  },
  loadingText: {
    marginTop: 10,
    color: "#0b9ca7",
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
