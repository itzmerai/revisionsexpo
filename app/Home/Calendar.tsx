import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView, // Import ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import NoNotifHeader from "@/components/NoNotifHeader";
import { AntDesign } from "@expo/vector-icons";
import Holidays from "./Holidays"; // Import the Holidays component

const Calendar = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Get the number of days in the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentDate) },
    (_, i) => i + 1
  );
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  // Check if a day is the current day
  const isToday = (day: number) => {
    const today = new Date();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const renderDayItem = ({ item }: { item: number | null }) => (
    <View style={styles.dayItem}>
      {item && (
        <View style={[isToday(item) && styles.todayCircle]}>
          <Text style={[styles.dayText, isToday(item) && styles.todayText]}>
            {item}
          </Text>
        </View>
      )}
    </View>
  );

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth - 1; i++) {
    calendarDays.push(null); // Add empty days for the start of the month
  }
  calendarDays.push(...daysInMonth);

  return (
    <View style={styles.container}>
      <NoNotifHeader
        title="Calendar"
        showBackButton={true}
        onBackPress={handleGoBack}
      />
      <Text style={styles.dateTitle}>Date View</Text>
      <View style={styles.calendarBox}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{`${monthName} ${year}`}</Text>
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              onPress={handlePreviousMonth}
              onPressIn={() => setIsLeftPressed(true)}
              onPressOut={() => setIsLeftPressed(false)}
            >
              <AntDesign
                name="caretleft"
                size={20}
                color={isLeftPressed ? "#0b9ca7" : "#999999"}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextMonth}
              onPressIn={() => setIsRightPressed(true)}
              onPressOut={() => setIsRightPressed(false)}
            >
              <AntDesign
                name="caretright"
                size={20}
                color={isRightPressed ? "#0b9ca7" : "#999999"}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.calendarContainer}>
          <View style={styles.weekDaysContainer}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>
          <FlatList
            data={calendarDays}
            renderItem={renderDayItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={7}
            contentContainerStyle={styles.daysContainer}
          />
        </View>
      </View>

      <Text style={styles.holidaysTitle}>Holidays</Text>
      <ScrollView style={styles.holidaysScrollView}>
        <Holidays />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendarBox: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#e3f2fd",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    backgroundColor: "#0b9ca7",
    color: "#fff",
    borderRadius: 5,
    fontFamily: "MontserratSemiBold",
  },
  arrowContainer: {
    flexDirection: "row",
  },
  arrowIcon: {
    marginLeft: 16, // Space between arrows
  },
  calendarContainer: {
    padding: 8,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 14,
    width: 40,
    textAlign: "center",
    fontFamily: "MontserratSemiBold",
  },
  daysContainer: {
    justifyContent: "space-between",
  },
  dayItem: {
    width: 32,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  dayText: {
    fontSize: 15,

    fontFamily: "MontserratRegular",
  },
  todayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15, // Makes it a circle
    backgroundColor: "#0b9ca7",
    justifyContent: "center",
    alignItems: "center",
  },
  todayText: {
    color: "white", // White text for better contrast
    fontWeight: "bold",
  },
  holidaysScrollView: {
    flex: 1, // Allow the ScrollView to take up remaining space
    marginHorizontal: 16,
    marginTop: 12,
  },
  holidaysTitle: {
    fontSize: 18,
    fontFamily: "MontserratBold",

    marginBottom: -15,
    left: 3,
    marginHorizontal: 16,
    marginTop: 12,
  },
  dateTitle: {
    fontSize: 18,
    marginBottom: -2,
    marginHorizontal: 16,
    marginTop: 16,
    left: 3,
    fontFamily: "MontserratBold",
  },
});

export default Calendar;
