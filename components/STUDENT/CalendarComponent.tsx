import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);

  const startDate = startOfWeek(startOfMonthDate);
  const endDate = endOfWeek(endOfMonthDate);

  const daysInCalendar = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const currentMonth = format(currentDate, "MMMM yyyy");

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.calendarHeader}>{currentMonth}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Days of the week */}
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day) => (
          <Text
            key={day}
            style={[styles.dayOfWeekText, day === "Sun" && styles.sundayText]}
          >
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {daysInCalendar.map((day) => (
          <View key={day.toString()} style={styles.dayContainer}>
            {isSameMonth(day, currentDate) ? (
              isToday(day) ? (
                <View style={styles.todayCircle}>
                  <Text style={styles.todayText}>{format(day, "d")}</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.dayText,
                    day.getDay() === 0 && styles.sundayText, // Apply red to Sundays
                  ]}
                >
                  {format(day, "d")}
                </Text>
              )
            ) : (
              <Text style={styles.dayText}></Text> // Blank for out of month
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  arrowText: {
    fontSize: 24,
    color: "#000",
    paddingHorizontal: 10,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  dayOfWeekText: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#000",
    paddingHorizontal: 8,
  },
  sundayText: {
    color: "red", // Red color for Sundays
    fontFamily: "MontserratRegular",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayContainer: {
    width: "13%",
    alignItems: "center",
    paddingVertical: 5,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "MontserratRegular",
  },
  todayCircle: {
    backgroundColor: "#007487",
    borderRadius: 30,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  todayText: {
    color: "#fff",

    fontSize: 14,
    fontFamily: "MontserratBold",
  },
});
