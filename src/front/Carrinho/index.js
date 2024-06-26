import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {AntDesign, FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {db} from '../../back/database';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../Auth';

export default function Carrinho({navigation}) {
  const [quantities, setQuantities] = useState({});
  // const route = useRoute();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCartItems();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const handleBackButtonClick = () => {
    navigation.goBack();
    return true;
  };

  const getCartItems = async () => {
    const cartData = await AsyncStorage.getItem('carrinho');
    const items = JSON.parse(cartData) || [];
    setCartItems(items);
  };

  const deleteCartItem = async itemId => {
    try {
      const {id} = useAuth().userInfo; // Assume que useAuth retorna userInfo
      const data = {
        idProduto: itemId,
        idUsuario: id,
      };
      const response = await axios.post(
        'https://appdist.qml.ao/deleteProdutoCarrinho',
        data,
      );

      const mensagem = response.data.mensagem;
      Alert.alert(mensagem);
    } catch (error) {
      console.error('Erro ao excluir item do carrinho:', error);
    }
  };

  const sendPedido = async () => {
    try {
      if (cartItems.length === 0) {
        Alert.alert('Não há itens selecionados!');
        return;
      }

      const {id} = useAuth().userInfo; // Assume que useAuth retorna userInfo

      for (const product of cartItems) {
        const {idProduto, quantidade} = product;
        const response = await axios.post(
          'https://appdist.qml.ao/addProdutoPedidos',
          {idProduto, quantidade, idUsuario: id},
        );
        if (response.status === 200) {
          navigation.navigate('Checkout');
        } else {
          console.error('Erro ao enviar pedido:', response.data.message);
          Alert.alert('Erro ao enviar pedido', response.data.message);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error.message);
      Alert.alert(
        'Erro ao enviar pedido',
        'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
      );
    }
  };

  const totalProduct = cartItems.length;

  const increaseQuantity = productId => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const decreaseQuantity = productId => {
    if (quantities[productId] > 1) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [productId]: prevQuantities[productId] - 1,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" color={COLORS.dominant} size={28} />
        </TouchableOpacity>
        <AntDesign name="shoppingcart" color={COLORS.dominant} size={28} />
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>
      <FlatList
        style={styles.productList}
        data={cartItems}
        renderItem={({item}) => (
          <View style={styles.productItem}>
            <Image
              source={{uri: item.imagem_principal}}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productDescription}>{item.descricao}</Text>
              <Text style={styles.productPrice}>{item.preco}</Text>
              <View style={styles.quantityButtons}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item.id)}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text>{quantities[item.id] || 1}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.id)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteCartItem(item.id)}>
              <FontAwesome name="trash-o" size={24} color={COLORS.title} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.cartDetails}>
        <Text style={styles.totalItems}>{totalProduct} Itens</Text>
        <View style={styles.promoCodeContainer}>
          <Text style={styles.promoCodeTitle}>Aplicar código promocional</Text>
          <TextInput style={styles.promoCodeInput} placeholder="PROM2023" />
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={sendPedido}>
          <MaterialIcons name="payment" size={24} color={COLORS.background} />
          <Text style={styles.checkoutButtonText}>Prosseguir para compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    zIndex: 9,
  },
  headerTitle: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    color: COLORS.dominant,
    marginLeft: 0,
  },
  productList: {
    marginTop: 100,
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: SIZES.body3,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: SIZES.body4,
    color: COLORS.textMuted,
    marginBottom: 5,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: SIZES.h5,
    color: COLORS.success,
    marginBottom: 5,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.title,
    borderRadius: 10,
    width: 30,
    height: 30,
    marginRight: 10,
  },
  quantityButtonText: {
    color: COLORS.background,
  },
  cartDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalItems: {
    fontSize: SIZES.body4,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  promoCodeContainer: {
    marginBottom: 20,
  },
  promoCodeTitle: {
    fontWeight: 'bold',
    fontSize: SIZES.body4,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  promoCodeInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.title,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    fontWeight: 'bold',
    fontSize: SIZES.body3,
    color: COLORS.background,
    marginLeft: 5,
  },
});
