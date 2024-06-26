import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {View, StyleSheet} from 'react-native';
import {useAuth} from '../../Auth';

const MyMap = ({keyU, locations}) => {
  const {region, latitude, longitude} = useAuth();

  return (
    <MapView
      showsBuildings={false}
      showsPointsOfInterest={false}
      style={styles.map}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.019,
        longitudeDelta: 0.018,
      }}
      key={keyU}
      showsMyLocationButton={false}>
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MyMap;
