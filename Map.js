import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ route }) {

  const initialRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [coordinates, setCoordinates] = useState(initialRegion);
  const [address, setAddress] = useState(route.params.address);

  const getCoordinates = () => {
    const url = 'http://www.mapquestapi.com/geocoding/v1/address?key=BO2XJGbSm7pGFgBIb0v438dneZCnrw5q&location=' + address;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        setCoordinates({
          latitude: responseJson.results[0].locations[0].latLng.lat,
          longitude: responseJson.results[0].locations[0].latLng.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }

  useEffect(() => {
    getCoordinates();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={coordinates}
      >
        <Marker
          coordinate={coordinates}
          title={address}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    width: 300
  },
});