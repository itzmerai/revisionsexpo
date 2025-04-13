import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TimeSchedule = () => {
  return (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleTitle}>Time Schedule</Text>

      {/* Header Row for Time In and Time Out */}
      <View style={styles.headerRow}>
        <Text style={styles.timeInHeader}>Time In</Text>
        <Text style={styles.timeOutHeader}>Time Out</Text>
      </View>

      {/* AM Time Slots */}
      <View style={styles.scheduleRow}>
        <Text style={styles.timeLabelAM}>AM</Text>
        <View style={styles.timeColumn}>
          <Text style={styles.timeInOut}>7:30-8:00 AM</Text>
          <Text style={styles.timeInOut}>12:00-12:30 PM</Text>
        </View>
      </View>

      {/* PM Time Slots */}
      <View style={styles.scheduleRow}>
        <Text style={styles.timeLabelPM}>PM</Text>
        <View style={styles.timeColumn}>
          <Text style={styles.timeInOut}>12:30-1:00 PM</Text>
          <Text style={styles.timeInOut}>5:00-5:30 PM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleContainer: {
    marginTop: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    paddingLeft: 50,
  },
  timeOutHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E14B62",
    paddingHorizontal: 45,
    paddingRight: 20,
  },
  timeInHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A77E4",
    paddingLeft: 20,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeLabelAM: {
    color: "#FC8210",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  timeLabelPM: {
    color: "#FC8210",
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  timeColumn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeInOut: {
    color: "#111",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 15,
  },
});

export default TimeSchedule;
