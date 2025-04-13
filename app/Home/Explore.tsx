import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";

type CustomButtonProps = {
  iconName: string;
  buttonText: string;
  onPress: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  iconName,
  buttonText,
  onPress,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <View style={styles.blackStrip}>
        <MaterialIcons name={iconName} size={24} color="#fff" />
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLocation = () => {
    router.push("/Home/Location");
  };

  const handleCalendar = () => {
    router.push("/Home/Calendar");
  };

  const handleTime = () => {
    router.push("/Home/Task");
  };

  return (
    <View>
      <CustomButton
        iconName="location-on"
        buttonText="Location"
        onPress={handleLocation}
      />

      <CustomButton
        iconName="calendar-today"
        buttonText="Calendar"
        onPress={handleCalendar}
      />

      <CustomButton
        iconName="assignment"
        buttonText="Task"
        onPress={handleTime}
      />

      {/* <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialIcons name="location-on" size={30} color="#0b9ca7" />
            <Text style={styles.modalTitle}>
              Allow OTMS to access this device’s location?
            </Text>
            <View style={styles.imageContainer}>
              <View style={styles.locationOption}>
                <MaterialIcons name="gps-fixed" size={50} color="#0b9ca7" />
                <Text style={styles.optionText}>Precise</Text>
              </View>
              <View style={styles.locationOption}>
                <MaterialIcons name="map" size={50} color="gray" />
                <Text style={styles.optionText}>Approximate</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleWhileUsingApp}
            >
              <Text style={styles.modalButtonText}>While using the app</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleOnlyThisTime}
            >
              <Text style={styles.modalButtonText}>Only this time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Don’t allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>*/}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  blackStrip: {
    width: screenWidth * 0.18,
    backgroundColor: "#0b9ca7",
    height: "100%",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: "center",
    paddingVertical: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
  },
  buttonText: {
    fontSize: 17,
    fontFamily: "MontserratRegular",
    color: "#000",
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: screenWidth * 0.85,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationOption: {
    alignItems: "center",
  },
  optionText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0b9ca7",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
});

export default Explore;
