import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {db} from '../../back/database';
import {Octicons, AntDesign, MaterialIcons} from '@expo/vector-icons';
import {useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

export default function Checkout({navigation}) {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [codigoPromo, setCodigoPromo] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [entregaVal, setEntregaVal] = useState(0);
  const route = useRoute();
  const product = route.params?.product;

  console.log(product);

  useEffect(() => {
    // saveColor()
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

  const renderProduct = item => (
    <View style={styles.productContainer} key={item.id}>
      <Image
        resizeMode="contain"
        source={{uri: item.imagem}}
        style={styles.productImage}
      />
      <View>
        <Text style={{fontWeight: 'bold', fontSize: SIZES.h5}}>
          {item.nome}
        </Text>
        <Text style={{fontWeight: 'bold', color: COLORS.preco}}>
          {item.preco} AKZ
        </Text>
        <Text>Quant. {item.quantidade}</Text>
      </View>
    </View>
  );

  const getTotalPrice = products => {
    return products.reduce((total, item) => total + parseFloat(item.preco), 0);
  };
  // Calcula o total dos preços
  const totalPrice = Array.isArray(product)
    ? getTotalPrice(product)
    : parseFloat(product.preco);

  const proced = total => {
    const discountAmount = totalPrice * discount;
    const totalAll = totalPrice + discountAmount + entregaVal;

    navigation.navigate('CheckoutDetails', {total: totalAll, product: product});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleBackButtonClick();
          }}>
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="payment" size={28} color={COLORS.dominant} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: SIZES.h5,
            fontWeight: 'bold',
            color: COLORS.dominant,
            marginLeft: -10,
          }}>
          Pagamentos
        </Text>
      </View>

      <ScrollView scrollEnabled={true}>
        {Array.isArray(product)
          ? product.map(renderProduct)
          : renderProduct(product)}
      </ScrollView>

      <View style={styles.paymentInfos}>
        <TouchableOpacity>
          <Text
            style={{
              color: COLORS.alerta,
              textDecorationLine: 'underline',
            }}>
            Aplique código promocional{' '}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            paddingVertical: 10,
            borderBottomColor: '#f5f5f5',
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: SIZES.h5, fontWeight: 'bold'}}>
              Subtotal
            </Text>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: 'bold',
                color: COLORS.preco,
              }}>
              AKZ {totalPrice}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              opacity: 0.5,
            }}>
            <Text style={{fontSize: SIZES.p, fontWeight: 'bold'}}>
              Desconto
            </Text>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: 'bold',
                color: COLORS.alerta,
              }}>
              -{discount}%
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              opacity: 0.5,
            }}>
            <Text style={{fontSize: SIZES.p, fontWeight: 'bold'}}>Entrega</Text>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: 'bold',
                color: COLORS.alerta,
              }}>
              {entregaVal == 0 ? 'Grátis' : `AKZ ${entregaVal}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 10,
            borderBottomColor: '#f5f5f5',
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: SIZES.h4, fontWeight: 'bold'}}>Total</Text>
            <Text
              style={{
                fontSize: SIZES.h4,
                fontWeight: 'bold',
                color: COLORS.preco,
              }}>
              AKZ {totalPrice * discount + totalPrice + entregaVal}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={proced}
          style={{
            alignSelf: 'center',
            backgroundColor: COLORS.dominant,
            padding: 10,
            borderRadius: 20,
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={{color: COLORS.background, fontSize: SIZES.h5}}>
            Pagar
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Octicons name="verified" size={34} color="green" />
      <Text style={{ fontSize: SIZES.h3, color: COLORS.dominant }}>
        Recebemos o seu pedido!
      </Text>
      <Text style={{ fontSize: SIZES.p, color: COLORS.dark }}>
        Brevemente a nossa equipe de vendas entrará em contato consigo,{" "}
        {userName.split(" ")[0]}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: 'none',
    width: '100%',
    position: 'absolute',
    top: -20,
    left: 0,
    height: 100,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 9,
    paddingHorizontal: 10,
  },
  productContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkOpacity,
    paddingVertical: 10,
    marginTop: 30,
    rowGap: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  paymentInfos: {
    backgroundColor: COLORS.background,
    width: SIZES.width,
    // height: 200,
    position: 'absolute',
    bottom: 0,
    shadowOffset: {
      width: 40,
      height: 40,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowColor: COLORS.shadow,
    elevation: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
});
