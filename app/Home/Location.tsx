import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { useNavigation } from "@react-navigation/native";
import NoNotifHeader from "@/components/NoNotifHeader";
import MapView, { Marker } from "react-native-maps";
import { Text, FlatList, Pressable, Image } from "react-native";
import { fetchNearbyMarkers } from "@/assets/markers"; // Import the fetch function

// Define the types
interface Coordinates {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Marker {
  name: string;
  coordinates: Coordinates;
  description: string;
  image?: string; // Optional if you want to include images
}

const Location = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<Marker[]>([]); // State for nearby markers

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show your current location on the map."
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = {
          latitude,
          longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        setUserLocation(location);

        // Fetch nearby markers based on user's location
        const markers = await fetchNearbyMarkers(latitude, longitude);
        setNearbyMarkers(markers);
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch location.");
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NoNotifHeader
        title="Location"
        showBackButton={true}
        onBackPress={handleGoBack}
      />

      <View style={styles.container2}>
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={userLocation || undefined}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {userLocation && (
            <Marker coordinate={userLocation} title="You are here" />
          )}
          {nearbyMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              title={marker.name}
              description={marker.description}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container2: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  map: {
    flex: 1,
  },
});

export default Location;
