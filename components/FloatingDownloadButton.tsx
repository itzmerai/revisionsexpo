import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";

const FloatingAddButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Octicons name="download" size={40} color="#0b9ca7" />{" "}
      {/* Set color to black */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 560, // Adjust this value to position the button above the tab bar
    right: 40,
    backgroundColor: "#ffffff", // Set background color to white or any other color you prefer
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default FloatingAddButton;
