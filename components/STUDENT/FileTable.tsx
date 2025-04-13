import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

interface Document {
  document_id: string;
  date_uploaded: string;
  remarks: string;
  uploaded_file: string;
}

interface FileTableProps {
  data: Document[];
}

const FileTable: React.FC<FileTableProps> = ({ data }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      date: date.toLocaleDateString(undefined, dateOptions),
      time: date.toLocaleTimeString(undefined, timeOptions),
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Upload History</Text>

      {data.map((document) => {
        const { date, time } = formatDateTime(document.date_uploaded);
        return (
          <View key={document.document_id} style={styles.reportContainer}>
            <Image
              source={{ uri: document.uploaded_file }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.separator}> | </Text>
                <Text style={styles.timeText}>{time}</Text>
              </View>
              <Text style={styles.remarksText}>{document.remarks}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    color: "#000",
    textAlign: "left",
    marginBottom: 0,
    bottom: 15,
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    fontFamily: "MontserratSemiBold",
    color: "#333",
  },
  separator: {
    fontSize: 16,
    color: "#0b9ca7",
    marginHorizontal: 4,
  },
  timeText: {
    fontSize: 13,
    fontFamily: "MontserratSemiBold",
    color: "blue",
  },
  remarksText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "MontserratRegular",
  },
});

export default FileTable;
