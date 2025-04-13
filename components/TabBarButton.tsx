import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AntDesign, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

// Define prop types
interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  onPress: () => void;
  onLongPress: () => void;
  style?: object; // Add style prop here
}

const TabBarButton: React.FC<TabBarButtonProps> = (props) => {
  const { isFocused, label, routeName, color, onPress, onLongPress, style } =
    props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, style]}
    >
      <Animated.View style={[animatedIconStyle]}>
        {routeName === "home" &&
          (isFocused ? (
            <Entypo name="home" size={24} color={color} />
          ) : (
            <AntDesign name="home" size={24} color={color} />
          ))}
        {routeName === "upload" &&
          (isFocused ? (
            <AntDesign name="cloudupload" size={24} color={color} />
          ) : (
            <AntDesign name="clouduploado" size={24} color={color} />
          ))}
        {routeName === "dtr" &&
          (isFocused ? (
            <MaterialCommunityIcons
              name="account-clock"
              size={24}
              color={color}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-clock-outline"
              size={24}
              color={color}
            />
          ))}
      </Animated.View>
      <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

export default TabBarButton;
