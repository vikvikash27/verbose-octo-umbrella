import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as ReactNative from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SIZES } from '../styles';

interface LocationMapViewProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

const LocationMapView: React.FC<LocationMapViewProps> = ({ onLocationChange }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Please enable location services to use the map feature.');
        return;
      }

      try {
        let locationResult = await Location.getCurrentPositionAsync({});
        const currentLoc = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        };
        setLocation(currentLoc);
        onLocationChange({ lat: currentLoc.latitude, lng: currentLoc.longitude });
      } catch (error) {
          setErrorMsg('Could not fetch location. Using default.');
          const defaultLoc = { latitude: 28.6139, longitude: 77.2090 }; // Default to Delhi
          setLocation(defaultLoc);
          onLocationChange({ lat: defaultLoc.latitude, lng: defaultLoc.longitude });
      }
    })();
  }, []);

  if (errorMsg && !location) {
    return (
      <View style={styles.container}>
        <ReactNative.Text>{errorMsg}</ReactNative.Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <ReactNative.Text style={styles.loadingText}>Getting your location...</ReactNative.Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={location}
          title="Your Location"
          description="Drag to adjust"
          draggable
          onDragEnd={(e) => {
            const newCoord = e.nativeEvent.coordinate;
            setLocation(newCoord);
            onLocationChange({ lat: newCoord.latitude, lng: newCoord.longitude });
          }}
        />
      </MapView>
    </View>
  );
};

const styles = ReactNative.StyleSheet.create({
  container: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
  },
  mapContainer: {
      height: 250,
      borderRadius: SIZES.base,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#d1d5db'
  },
  map: {
    ...ReactNative.StyleSheet.absoluteFillObject,
  },
  loadingText: {
      marginTop: SIZES.small,
      color: COLORS.gray
  }
});

export default LocationMapView;