import { View, StyleSheet } from "react-native";
import React from "react";
import TabBarButton from "./TabBarButton";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabBarProps extends BottomTabBarProps {
  isProfileVisible: boolean;
}

const TabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
  isProfileVisible,
}) => {
  const primaryColor = "#ffffff";
  const greyColor = "#ffffff";

  if (isProfileVisible) {
    return null;
  }
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Ensure label is always a string
        const label: string =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0b9ca7",
    marginHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 25,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    zIndex: 2000, // Ensure this is lower than the profileOverlay's zIndex
  },

  tabbarItem: {
    flex: 1, // Adjust based on your layout needs
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TabBar;
