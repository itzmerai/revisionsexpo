import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import NoNotifHeader from "@/components/NoNotifHeader";

interface Coordinates {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const LocationScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  // Default coordinates (Manila coordinates as fallback)
  const defaultRegion = {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        handleLocationError();
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.error(error);
      handleLocationError();
    }
  };

  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setUserLocation(newRegion);
      setLoading(false);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.error(error);
      handleLocationError();
    }
  };

  const handleLocationError = () => {
    Alert.alert(
      "Location Required",
      "Using default location. Some features might be limited.",
      [{ text: "OK" }]
    );
    setUserLocation(defaultRegion);
    setLoading(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NoNotifHeader
          title="Location"
          showBackButton={true}
          onBackPress={handleGoBack}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NoNotifHeader
        title="Location"
        showBackButton={true}
        onBackPress={handleGoBack}
      />

      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={userLocation || defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsCompass={true}
        loadingEnabled={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="You are here"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LocationScreen;