import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (remarks: string, fileUri: string | null) => void;
  taskId: number | null;
}

const UploadTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
  taskId,
}) => {
  const [remarks, setRemarks] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Need camera roll access to upload files"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setFileName(
          asset.fileName || asset.uri.split("/").pop() || "Unknown File"
        );
        setSelectedFile(asset.uri);
      }
    } catch (err) {
      console.error("Error picking file:", err);
      Alert.alert("Error", "Failed to select file");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      const studentId = await AsyncStorage.getItem("student_id");
      
      if (!studentId || !taskId) {
        Alert.alert("Error", "Missing student or task information");
        return;
      }

      if (!selectedFile) {
        Alert.alert("Error", "Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("task_id", taskId.toString());
      formData.append("remarks", remarks);

      // Get file info and create proper upload object
      const fileInfo = await FileSystem.getInfoAsync(selectedFile);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileType = fileInfo.uri.split('.').pop() || 'jpeg';
      const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;

      formData.append("document", {
        uri: selectedFile,
        name: fileName || `upload-${Date.now()}.${fileType}`,
        type: mimeType,
      } as any);

      const response = await fetch(
        `${Config.API_BASE_URL}/api/task-uploads`,
        {
          method: "POST",
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Upload failed");
      }

      onAddTask(remarks, selectedFile);
      Alert.alert("Success", "Task uploaded successfully");
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload task";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsUploading(false);
      setRemarks("");
      setFileName(null);
      setSelectedFile(null);
    }
  };


  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upload Task</Text>

          <View style={styles.addFilesContainer}>
            <MaterialIcons name="cloud-upload" size={40} color="#0b9ca7" />
            <TouchableOpacity
              onPress={handleFileSelection}
              disabled={isUploading}
            >
              <Text style={styles.chooseFilesLink}>
                {isUploading ? "Uploading..." : "Choose Image"}
              </Text>
            </TouchableOpacity>
            {fileName && (
              <Text style={styles.selectedFileName}>{fileName}</Text>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter task details..."
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={4}
            editable={!isUploading}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                isUploading && styles.disabledButton,
              ]}
              onPress={onClose}
              disabled={isUploading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isUploading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isUploading}
            >
              <Text style={styles.buttonText}>
                {isUploading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "MontserratBold",

    marginBottom: 20,
  },
  addFilesContainer: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  chooseFilesLink: {
    color: "#0b9ca7",
    textDecorationLine: "underline",
    fontFamily: "MontserratSemiBold",

    textAlign: "center",
  },
  selectedFileName: {
    marginTop: 10,
    color: "#555",
    fontStyle: "italic",
  },
  disabledButton: {
    opacity: 0.6,
  },
  input: {
    height: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
    textAlignVertical: "top",
    fontFamily: "MontserratRegular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#A9A9A9",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    fontFamily: "MontserratRegular",
  },
  submitButton: {
    backgroundColor: "#0b9ca7",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    fontFamily: "MontserratRegular",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
});

export default UploadTaskModal;
