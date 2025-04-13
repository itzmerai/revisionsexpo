import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";

interface AnnouncementModalProps {
  isVisible: boolean; // Control visibility of the modal
  message: string; // Message to display
  onClose: () => void; // Callback to close the modal
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  useEffect(() => {}, [message]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.messageText}>
            <Text style={styles.boldText}>{message.split(":")[0]}:</Text>{" "}
            {message.split(":")[1]}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AnnouncementModal;
