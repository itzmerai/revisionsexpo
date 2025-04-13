import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Holidays = () => {
  const [isRegularPressed, setIsRegularPressed] = useState(false);
  const [isSpecialNonWorkingPressed, setIsSpecialNonWorkingPressed] =
    useState(false);
  const [isSpecialWorkingPressed, setIsSpecialWorkingPressed] = useState(false);
  const [isRegularExpanded, setIsRegularExpanded] = useState(false);
  const [isSpecialNonWorkingExpanded, setIsSpecialNonWorkingExpanded] =
    useState(false);
  const [isSpecialWorkingExpanded, setIsSpecialWorkingExpanded] =
    useState(false);

  const regularHolidays = [
    { name: "New Year's Day", date: "January 1" },
    { name: "Maundy Thursday", date: "Movable Date" },
    { name: "Good Friday", date: "Movable Date" },
    { name: "Araw ng Kagitingan", date: "April 9" },
    { name: "Labor Day", date: "May 1" },
    { name: "Independence Day", date: "June 12" },
    { name: "National Heroes Day", date: "Last Monday of August" },
    { name: "Bonifacio Day", date: "November 30" },
    { name: "Eidul Fitr", date: "Movable Date" },
    { name: "Eidul Adha", date: "Movable Date" },
    { name: "Christmas Day", date: "December 25" },
    { name: "Rizal Day", date: "December 30" },
  ];

  const specialNonWorkingHolidays = [
    { name: "Ninoy Aquino Day", date: "August 21" },
    { name: "All Saints' Day", date: "November 1" },
    { name: "Feast of the Immaculate Conception", date: "December 8" },
    { name: "Chinese New Year", date: "January 29" },
    { name: "Black Saturday", date: "April 19" },
  ];

  const specialWorkingHolidays = [
    { name: "EDSA People Power Anniversary", date: "February 25" },
  ];

  const handleRegularPress = () => {
    setIsRegularPressed(!isRegularPressed);
    setIsRegularExpanded(!isRegularExpanded);
  };

  const handleSpecialNonWorkingPress = () => {
    setIsSpecialNonWorkingPressed(!isSpecialNonWorkingPressed);
    setIsSpecialNonWorkingExpanded(!isSpecialNonWorkingExpanded);
  };

  const handleSpecialWorkingPress = () => {
    setIsSpecialWorkingPressed(!isSpecialWorkingPressed);
    setIsSpecialWorkingExpanded(!isSpecialWorkingExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Regular Holidays Button */}
      <TouchableOpacity
        style={[
          styles.holidayButton,
          isRegularPressed && styles.holidayButtonPressed,
        ]}
        onPress={handleRegularPress}
      >
        <Text
          style={[
            styles.holidayButtonText,
            isRegularPressed && styles.holidayButtonTextPressed,
          ]}
        >
          Regular Holidays
        </Text>
      </TouchableOpacity>

      {/* Regular Holidays Details */}
      {isRegularExpanded && (
        <View style={styles.holidayDetails}>
          {regularHolidays.map((holiday, index) => (
            <View key={index} style={styles.holidayRow}>
              <Text style={styles.holidayName}>{holiday.name}</Text>
              <Text style={styles.holidayDate}>{holiday.date}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Special (Non-Working) Holidays Button */}
      <TouchableOpacity
        style={[
          styles.holidayButton,
          isSpecialNonWorkingPressed && styles.holidayButtonPressed,
        ]}
        onPress={handleSpecialNonWorkingPress}
      >
        <Text
          style={[
            styles.holidayButtonText,
            isSpecialNonWorkingPressed && styles.holidayButtonTextPressed,
          ]}
        >
          Special (Non-Working) Holidays
        </Text>
      </TouchableOpacity>

      {/* Special (Non-Working) Holidays Details */}
      {isSpecialNonWorkingExpanded && (
        <View style={styles.holidayDetails}>
          {specialNonWorkingHolidays.map((holiday, index) => (
            <View key={index} style={styles.holidayRow}>
              <Text style={styles.holidayName}>{holiday.name}</Text>
              <Text style={styles.holidayDate}>{holiday.date}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Special (Working) Holidays Button */}
      <TouchableOpacity
        style={[
          styles.holidayButton,
          isSpecialWorkingPressed && styles.holidayButtonPressed,
        ]}
        onPress={handleSpecialWorkingPress}
      >
        <Text
          style={[
            styles.holidayButtonText,
            isSpecialWorkingPressed && styles.holidayButtonTextPressed,
          ]}
        >
          Special (Working) Holidays
        </Text>
      </TouchableOpacity>

      {/* Special (Working) Holidays Details */}
      {isSpecialWorkingExpanded && (
        <View style={styles.holidayDetails}>
          {specialWorkingHolidays.map((holiday, index) => (
            <View key={index} style={styles.holidayRow}>
              <Text style={styles.holidayName}>{holiday.name}</Text>
              <Text style={styles.holidayDate}>{holiday.date}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: "column", // Stack buttons vertically
    justifyContent: "space-between",
  },
  holidayButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0b9ca7",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8, // Add vertical margin between buttons
    alignItems: "center",
    justifyContent: "center",
  },
  holidayButtonPressed: {
    backgroundColor: "#0b9ca7",
  },
  holidayButtonText: {
    fontSize: 16,
    color: "#0b9ca7",
    fontFamily: "MontserratSemiBold",
  },
  holidayButtonTextPressed: {
    color: "#fff", // Change text color when pressed
  },
  holidayDetails: {
    marginTop: 8,
  },
  holidayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  holidayName: {
    fontSize: 13,
    color: "#000",
    fontFamily: "MontserratRegular",
  },
  holidayDate: {
    fontSize: 13,
    color: "#FF7F7F", // Updated color for the date
    fontFamily: "MontserratRegular",
  },
});

export default Holidays;
