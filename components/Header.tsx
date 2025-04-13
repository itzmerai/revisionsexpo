import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import NotificationIcon from "./NotificationIcon";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerr}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress}>
            <EvilIcons
              name="chevron-left"
              size={30}
              color="#fff"
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>{title}</Text>

        <NotificationIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: "#0b9ca7",
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  headerr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "MontserratBold", // Added MontserratBold font
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
});

export default Header;
