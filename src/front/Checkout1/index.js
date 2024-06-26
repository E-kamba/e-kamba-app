import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {Octicons, AntDesign, MaterialIcons, Ionicons} from '@expo/vector-icons';
import {useRoute} from '@react-navigation/native';
import * as Location from 'expo-location';
import {useAuth} from '../Auth';
import MyMap from '../Components/Map';
import axios from 'axios';
// import BottomSheet from '@gorhom/bottom-sheet';

export default function CheckoutDetails({navigation}) {
  const route = useRoute();
  const total = route.params?.total;
  const product = route.params?.product;
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const {
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    region,
    setRegion,
    setLocal,
    local,
    locations,
    setLocations,
  } = useAuth();

  // let [snapHeigth, setSnapHeigth] = useState(10);
  // const snapPoints = useMemo(() => {
  //   if (step2) {
  //     return step2 ? ['40%'] : ['10%'];
  //   } else {
  //     return showPoints ? ['87%'] : ['10%'];
  //   }
  // }, [step2, showPoints]);

  // callbacks
  const handleSheetChanges = useCallback(() => {
    setTimeout(() => {
      return snapPoints;
    }, 0.01);
    setShowPoints(false);
  }, []);

  useEffect(() => {
    requestLocationPermission();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  const sendPedidos = async () => {};

  const [mapData, setMapData] = useState({
    latitude: latitude,
    longitude: longitude,
    refreshCounter: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.14,
  });

  const isProductArray = Array.isArray(product);
  const productName = isProductArray
    ? product.length === 1
      ? product[0].nome
      : 'Produtos diversos'
    : product.name;

  const requestLocationPermission = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const {latitude, longitude} = location.coords;

        if (latitude !== null && longitude !== null) {
          getCurrentLocation(latitude, longitude);
          setLatitude(latitude);
          setLongitude(longitude);

          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          setRegion(region);
          // setInitialRegion(region);
        } else {
          console.error('Localização inválida');
        }
      } else {
        console.log('Permission to access background location was denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
          },
        },
      );

      if (response.status === 200) {
        const {data} = response;
        const {address} = data;
        const myLocation = [
          address.country,
          address.state,
          address.village || address.city || address.town, // Qualquer um que estiver disponível
        ]
          .filter(Boolean)
          .join(', ');

        setAddress(myLocation);
        console.log(myLocation);
      } else {
        console.error(
          'Erro ao buscar informações de localização: Status não OK',
        );
        Alert.alert('Erro', 'Erro ao buscar informações de localização.');
      }
    } catch (error) {
      console.error('Erro ao buscar informações de localização:', error);
      Alert.alert('Erro', 'Erro ao buscar informações de localização.');
    }
  };

  return (
    <>
      {showMap == false ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButtonClick}>
              <AntDesign name="arrowleft" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pagamentos</Text>
            <TouchableOpacity>
              <MaterialIcons name="payment" size={28} color={COLORS.dominant} />
            </TouchableOpacity>
          </View>

          <ScrollView scrollEnabled={true} style={{marginTop: 60}}>
            <View style={styles.section}>
              <Octicons name="archive" size={24} color="black" />
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Meu pedido</Text>
                <Text style={styles.sectionSubtitle}>{productName}</Text>
                <Text style={styles.totalText}>Total a pagar: {total} KZ</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Ionicons name="location-outline" size={24} color="black" />
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Endereço para entrega</Text>
                <Text style={styles.sectionSubtitle}>{address}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMap(true)}>
                <Text style={styles.changeText}>Alterar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Ionicons name="card-outline" size={24} color="black" />
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>Metódo de pagamento</Text>
                {/* <Text style={styles.sectionSubtitle}>{address}</Text> */}
              </View>
              <TouchableOpacity>
                <Text style={styles.changeText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.paymentInfos}>
            <TouchableOpacity style={styles.concluirPedidoButton}>
              <Text style={styles.concluirPedidoText}>Concluir pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <MyMap keyU={mapData.refreshCounter} />
          <View
            style={[
              styles.header,
              {
                justifyContent: 'flex-start',
                gap: 10,
                marginTop: -20,
              },
            ]}>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <AntDesign name="arrowleft" size={24} />
            </TouchableOpacity>
            <Ionicons name="map-outline" size={24} color={COLORS.dominant} />
            <Text style={styles.headerTitle}>Endereços</Text>
          </View>
          
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    width: '100%',
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 9,
  },
  headerTitle: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    color: COLORS.dominant,
    marginLeft: -10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingBottom: 10,
  },
  sectionContent: {
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    opacity: 0.3,
  },
  totalText: {
    opacity: 0.5,
    fontWeight: 'bold',
  },
  changeText: {
    color: COLORS.dominant,
    fontWeight: 'bold',
  },
  paymentInfos: {
    backgroundColor: COLORS.background,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 40, height: 40},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowColor: COLORS.shadow,
    elevation: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  concluirPedidoButton: {
    backgroundColor: COLORS.dominant,
    padding: 10,
    borderRadius: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 30,
  },
  concluirPedidoText: {
    color: COLORS.background,
    fontSize: SIZES.h5,
  },
  input: {
    padding: 8,
    height: 40,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#e1f5fe',
    paddingLeft: 10,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-start',
    // borderWidth: 1
  },
});
