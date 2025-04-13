import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface TaskCardProps {
  taskType: string;
  description: string;
  progress: number;
  onAddPress?: () => void;
  onCardPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  taskType,
  description,
  progress,
  onAddPress,
  onCardPress,
}) => {
  return (
    <View style={styles.card}>
      <TouchableWithoutFeedback onPress={onCardPress}>
        <View>
          <Text style={styles.taskType}>{taskType}</Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progress}%</Text>
            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Icon name="cloud-upload" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.addButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  taskType: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 5,
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
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 3,
  },
  addButton: {
    backgroundColor: "#0b9ca7",
    paddingVertical: 12,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    elevation: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "MontserratBold",
    marginLeft: 8, // Add some space between icon and text
  },
  icon: {
    marginRight: 4, // Adjust icon spacing
  },
});

export default TaskCard;
