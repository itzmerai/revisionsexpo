import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import NoNotifHeader from "@/components/NoNotifHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

const HistoryTaskUpload = () => {
  const navigation = useNavigation();
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  
  // Handle taskId parameter normalization
  const { taskId, taskTitle } = useLocalSearchParams();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const fetchHistory = async () => {
    try {
      setRefreshing(true);
      const studentId = await AsyncStorage.getItem("student_id");
      
      console.log("Fetching history with:", {
        studentId,
        taskId
      });

      if (!studentId || !taskId) {
        const missing = [];
        if (!studentId) missing.push("Student ID");
        if (!taskId) missing.push("Task ID");
        
        Alert.alert("Missing Information", 
          `Please make sure you have:
          ${missing.join("\n• ")}`
        );
        return;
      }

      const apiUrl = `${Config.API_BASE_URL}/api/task-uploads/history?student_id=${studentId}&task_id=${taskId}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);
      
      setUploadHistory(data);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", 
        error instanceof Error ? error.message : "Failed to load history"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchHistory();
    } else {
      Alert.alert("Error", "No task specified");
      navigation.goBack();
    }
  }, [taskId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b9ca7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NoNotifHeader
        title="Upload History"
        showBackButton={true}
        onBackPress={handleGoBack}
      />

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchHistory}
            colors={["#0b9ca7"]}
            tintColor="#0b9ca7"
          />
        }
      >
        {uploadHistory.length > 0 ? (
          uploadHistory.map((item) => (
            <View key={item.uploaded_task_id} style={styles.historyItem}>
              <View style={styles.historyHeader}>
              <Text style={styles.taskType}>
                {taskTitle || "Task Submission"}  {/* Fallback if title not available */}
              </Text>
                <Text style={styles.date}>{item.uploaded_date}</Text>
              </View>
              
              {item.uploaded_taskdocument ? (
                <Image
                  source={{ uri: item.uploaded_taskdocument }}
                  style={styles.uploadImage}
                  resizeMode="contain"
                  onError={(e) => console.log("Image error:", e.nativeEvent.error)}
                />
              ) : (
                <Text style={styles.missingDocument}>No document attached</Text>
              )}

              <View style={styles.remarksContainer}>
                <Text style={styles.remarksLabel}>Remarks:</Text>
                <Text style={styles.remarksText}>
                  {item.remarks || "No remarks provided"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noHistoryText}>No upload history found</Text>
            <Text style={styles.noHistorySubText}>
              {taskId ? `for task ID: ${taskId}` : ""}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    marginBottom: 12,
  },
  taskType: {
    fontSize: 16,
    fontFamily: "MontserratBold",
    color: "#000",
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontFamily: "MontserratRegular",
    marginTop: 4,
  },
  uploadImage: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 5,
  },
  remarksContainer: {
    marginTop: 8,
  },
  remarksLabel: {
    fontSize: 14,
    fontFamily: "MontserratSemiBold",
    color: "#333",
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: "MontserratRegular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noHistoryText: {
    textAlign: "center",
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  noHistorySubText: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    fontFamily: "MontserratRegular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  missingDocument: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
  },
});

export default HistoryTaskUpload;