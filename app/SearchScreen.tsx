import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Header from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";

type TimesheetEntry = {
  date: string;
  morning: { in: string; out: string };
  afternoon: { in: string; out: string };
  totalHours: number;
};

type RootStackParamList = {
  SearchScreen: undefined;
};

type SearchScreenRouteProp = RouteProp<RootStackParamList, "SearchScreen">;

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<SearchScreenRouteProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([]);
  const [filteredData, setFilteredData] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudentTimesheet();
  }, []);

  const fetchStudentTimesheet = async () => {
    try {
      setIsLoading(true);
      const studentId = await AsyncStorage.getItem("student_id");
      if (!studentId) {
        console.error("Student ID not found in AsyncStorage");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${Config.API_BASE_URL}/api/student-timesheets?student_id=${studentId}`
      );
      const data = await response.json();

      if (response.ok) {
        setTimesheet(data.timesheet);
        setFilteredData(data.timesheet);
      } else {
        console.error("Error fetching timesheet:", data.error);
      }
    } catch (error) {
      console.error("Error fetching timesheet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredData(timesheet);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = timesheet.filter((item) => {
      return (
        item.date.toLowerCase().includes(lowerCaseQuery) ||
        item.morning.in.toLowerCase().includes(lowerCaseQuery) ||
        item.morning.out.toLowerCase().includes(lowerCaseQuery) ||
        item.afternoon.in.toLowerCase().includes(lowerCaseQuery) ||
        item.afternoon.out.toLowerCase().includes(lowerCaseQuery) ||
        item.totalHours.toString().includes(query)
      );
    });

    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Search Records"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.searchContainer}>
        <TextInput
          autoFocus
          style={styles.searchInput}
          placeholder="Search date or time"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView style={styles.tableContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0b9ca7" />
            <Text style={styles.loadingText}>Loading records...</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <Text style={styles.noResultsText}>No records found...</Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
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

            {filteredData.map((row, index) => (
              <View key={index} style={styles.rowContainer}>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.date}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.timeText}>
                    In: <Text style={styles.inTime}>{row.morning.in}</Text>
                  </Text>
                  <Text style={styles.timeText}>
                    Out: <Text style={styles.outTime}>{row.morning.out}</Text>
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.timeText}>
                    In: <Text style={styles.inTime}>{row.afternoon.in}</Text>
                  </Text>
                  <Text style={styles.timeText}>
                    Out: <Text style={styles.outTime}>{row.afternoon.out}</Text>
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{row.totalHours} hrs</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    color: "#0b9ca7",
    fontSize: 16,
    fontFamily: "MontserratRegular",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: "MontserratRegular",
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: 15,
    top: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0b9ca7",
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "MontserratSemiBold",
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
  timeText: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "MontserratRegular",
  },
  inTime: {
    color: "#0b9ca7",
    fontWeight: "bold",
    fontFamily: "MontserratSemiBold",
  },
  outTime: {
    color: "red",
    fontWeight: "bold",
    fontFamily: "MontserratSemiBold",
  },
});

export default SearchScreen;
