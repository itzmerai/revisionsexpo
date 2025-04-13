import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NoNotifHeader from "@/components/NoNotifHeader";
import TaskCard from "./TASK/TaskCard";
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import UploadTaskModal from "@/components/STUDENT/MODAL/UploadTaskModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

interface Task {
  task_id: number;
  task_title: string;
  task_description: string;
  task_created: string;
  task_rating?: number;
}

const Task = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        const response = await fetch(
          `${Config.API_BASE_URL}/api/assigned-tasks?student_id=${studentId}`
        );
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddPress = (taskId: number) => {
    setSelectedTaskId(taskId);
    setUploadModalVisible(true);
  };

  const handleCardPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

// In the Task component, modify the handleHistoryPress function
// Update the handleHistoryPress function
const handleHistoryPress = () => {
  if (selectedTask) {
    router.push({
      pathname: "/Home/TASK/HistoryTaskUpload",
      params: { 
        taskId: selectedTask.task_id.toString(),
        taskTitle: selectedTask.task_title 
      },
    });
  }
};

  const handleAddTask = (remarks: string, fileUri: string | null) => {
    console.log("Task uploaded:", { remarks, fileUri });
    setUploadModalVisible(false);
  };

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
        title="Tasks"
        showBackButton={true}
        onBackPress={handleGoBack}
      />

      <ScrollView style={styles.scrollContainer}>
      {tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            taskType={task.task_title}
            description={task.task_description}
            progress={task.task_rating || 0}
            onAddPress={() => handleAddPress(task.task_id)}
            onCardPress={() => handleCardPress(task)}
          />
        ))}
      </ScrollView>

      {/* Task Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedTask && (
                  <>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity
                        onPress={handleHistoryPress}
                        style={styles.historyIcon}
                      >
                        <Icon name="list-alt" size={24} color="#0b9ca7" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.modalTaskType}>
                      {selectedTask.task_title}
                    </Text>
                    <Text style={styles.modalDescription}>
                      {selectedTask.task_description}
                    </Text>
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>
                        {selectedTask.task_rating || 'Not rated yet'}
                      </Text>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${selectedTask.task_rating || 0}%` },
                          ]}
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Upload Task Modal */}
      <UploadTaskModal
          visible={uploadModalVisible}
          onClose={() => setUploadModalVisible(false)}
          onAddTask={handleAddTask}
          taskId={selectedTaskId}
        />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 8,
  },
  historyIcon: {
    padding: 4,
  },
  modalTaskType: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    color: "#000",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: "MontserratRegular",
  },
  progressContainer: {
    marginBottom: 0,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "MontserratSemiBold",
    color: "#2196F3",
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default Task;