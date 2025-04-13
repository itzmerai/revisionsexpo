import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import the icon library
import Header from "@/components/Header"; // Import the Header component
import DTRTable from "@/components/STUDENT/DTRTable";
import FloatingDownloadButton from "@/components/FloatingAddButton"; // Import the FloatingAddButton
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function DTRScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Get the navigation object

  // Function to handle back button press
  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen (home screen)
  };

  return (
    <View style={styles.container}>
      <Header title="DTR" showBackButton={true} onBackPress={handleGoBack} />
      <ScrollView style={styles.container}>
        <View style={styles.container2}>
          <DTRTable />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20, // Add some space below the header
  },
  container2: {
    flex: 1,
    paddingHorizontal: 0, // Add horizontal padding for better spacing
  },
});
