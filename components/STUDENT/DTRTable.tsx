import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type TimesheetEntry = {
  date: string;
  morning: { in: string; out: string };
  afternoon: { in: string; out: string };
  totalHours: number;
};

type RootStackParamList = {
  SearchScreen: { timesheet: TimesheetEntry[] };
};

type DTRTableNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchScreen"
>;

const DTRTable = () => {
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([]);
  const navigation = useNavigation<DTRTableNavigationProp>();

  useEffect(() => {
    let isMounted = true;

    const fetchStudentTimesheet = async () => {
      try {
        const studentId = await AsyncStorage.getItem("student_id");
        if (!studentId) {
          console.error("Student ID not found in AsyncStorage");
          return;
        }

        const response = await fetch(
          `${Config.API_BASE_URL}/api/student-timesheets?student_id=${studentId}`
        );
        const data = await response.json();

        if (response.ok && isMounted) {
          setTimesheet(data.timesheet);
        } else {
          console.error("Error fetching timesheet:", data.error);
        }
      } catch (error) {
        console.error("Error fetching timesheet:", error);
      }
    };

    // Fetch initially
    fetchStudentTimesheet();

    // Poll every 10 seconds
    const interval = setInterval(fetchStudentTimesheet, 10000);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSearchPress = () => {
    navigation.navigate("SearchScreen", { timesheet });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Records</Text>

      <View style={styles.tableHeader}>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Day</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Date</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Morning</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Afternoon</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Hours</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {timesheet.map((row, index) => (
          <View key={index} style={styles.rowContainer}>
            <View style={styles.tableRow}>
              <View style={styles.cell}>
                <Text style={styles.cellText}>{index + 1}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>{row.date}</Text>
              </View>
              <View style={styles.cell}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>
                    In: <Text style={styles.inTime}>{row.morning.in}</Text>
                  </Text>
                  <Text style={styles.timeText}>
                    Out: <Text style={styles.outTime}>{row.morning.out}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.cell}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>
                    In: <Text style={styles.inTime}>{row.afternoon.in}</Text>
                  </Text>
                  <Text style={styles.timeText}>
                    Out: <Text style={styles.outTime}>{row.afternoon.out}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellText}>{row.totalHours} hrs</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  heading: {
    fontSize: 18,
    color: "#000",
    textAlign: "left",
    marginBottom: 10,
    fontFamily: "MontserratBold",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0b9ca7",
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  headerText: {
    textAlign: "center",
    fontSize: 9,
    color: "#fff",
    fontFamily: "MontserratSemiBold",
  },
  scrollContainer: {
    flex: 1,
  },
  rowContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  cellText: {
    textAlign: "center",
    fontSize: 8,
    fontFamily: "MontserratRegular",
  },
  timeCell: {
    alignItems: "flex-start",
  },
  timeText: {
    fontSize: 7,
    textAlign: "left",
    fontFamily: "MontserratRegular",
  },
  inTime: {
    color: "#0b9ca7",
    fontWeight: "bold",
  },
  outTime: {
    color: "red",
    fontWeight: "bold",
  },
});

export default DTRTable;
