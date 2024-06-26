import React, {useEffect, useState} from 'react';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  SimpleLineIcons,
  Entypo,
  Ionicons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import {
  View,
  StyleSheet,
  Text,
  BackHandler,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {useRoute} from '@react-navigation/native';
import {useAuth} from '../Auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from '../Components/Modal';
import DropDownPicker from 'react-native-dropdown-picker';

const Categorias = ({navigation}) => {
  const {produtos, userInfo, subcategorias} = useAuth();
  const route = useRoute();
  const categoria = route.params?.categoria;
  const categoriaId = route.params?.id;
  const categoriaImg = route.params?.image;
  const [modalConfig, setModalConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  let loadImage = require('../../../assets/loadicon-1.gif');

  const [loadText, setloadText] = useState('');

  let productFilt = produtos.filter(item => item.categoria === categoriaId);
  let productFiltTop = produtos.filter(
    item => item.categoria === categoriaId && item.estrelas >= 3.5,
  );
  let productAll = produtos.filter(
    item => item.categoria === categoriaId && item.estrelas < 3.5,
  );

  const subcategoriaFilt = subcategorias.filter(
    item => item.categoria === categoriaId,
  );

  useEffect(() => {
    setFilteredProducts(productFilt);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const verifyItemsCart = async product => {
    try {
      if (Object.keys(userInfo).length > 0) {
        const cartData = await AsyncStorage.getItem('carrinho');
        const newData = JSON.parse(cartData) || [];

        const checkItem = newData.find(item => item.id === product.id);
        let modalConfig = {};

        if (checkItem) {
          modalConfig = {
            icon: 'error-outline',
            title: 'Erro ao adicionar ao carrinho',
            text: 'Este item já foi adicionado ao carrinho.',
          };
        } else {
          await addToCart(product, newData);
        }
      } else {
        modalConfig = {
          icon: 'error-outline',
          title: 'Erro ao adicionar ao carrinho',
          text: 'Crie uma conta!.',
        };
      }

      setShowModal(true);
      setModalConfig(modalConfig);
    } catch (error) {
      console.error('Erro ao verificar itens no carrinho:', error);
    }
  };

  const addToCart = async (product, newData) => {
    try {
      newData.push({id: product.id, quantidade: 1, idUsuario: userId});

      await AsyncStorage.setItem('carrinho', JSON.stringify(newData));
      setCartData(newData);
      await continueAddItem(product.id);
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
    }
  };

  const continueAddItem = async itemId => {
    try {
      const produto = {
        idProduto: itemId,
        quantidade: 1,
        idUsuario: userId,
      };
      await axios.post('https://appdist.qml.ao/addProdutoCarrinho', produto);
    } catch (error) {
      console.error('Erro ao continuar adicionando item ao carrinho:', error);
    }
  };
  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const selectItem = id => {
    setSelectedItem(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 4}}
          onPress={() => {
            handleBackButtonClick();
          }}>
          <AntDesign name="arrowleft" size={20} color={COLORS.background} />
          <Text
            style={{
              fontSize: SIZES.h6,
              fontWeight: 'bold',
              color: COLORS.background,
            }}>
            {categoria}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: SIZES.width,
          height: 200,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
        }}>
        <Image source={categoriaImg} style={{width: '100%', height: '100%'}} />
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.darkOpacity,
            flexDirection: 'column',
          }}></View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: SIZES.width,
          justifyContent: 'space-between',
          paddingHorizontal: 35,
          marginTop: 20,
        }}>
        <Text>{filteredProducts.length} Produtos</Text>
      </View>
      {/* produtos popular */}

      <ScrollView style={{}}>
        <FlatList
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            gap: 20,
            // width: SIZES.width,
            // height: 180,
          }}
          contentContainerStyle={{paddingHorizontal: 10}}
          horizontal={true}
          scrollIndicatorInsets
          data={subcategoriaFilt}
          keyExtractor={(item, index) => index.toString()} // Adicionando keyExtractor
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{padding: 9}}
                onPress={() => setSelectedItem(item.id)}>
                <Text
                  style={{
                    fontSize: SIZES.h4,
                    fontWeight: selectedItem === item.id ? 'bold' : 'normal',
                    opacity: selectedItem === item.id ? 1 : 0.4,
                    color: selectedItem === item.id ? COLORS.dominant : "#000",
                  }}>
                  {item.subcategoria}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        {filteredProducts !== null ? (
          <FlatList
            style={{
              width: SIZES.width,
              paddingTop: 0,
              paddingLeft: 20,
              paddingBottom: 40,
            }}
            numColumns={2}
            data={filteredProducts}
            renderItem={({item, index}) => {
              return (
                <View style={styles.productContainer}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate('Produto', {
                        produto: item,
                      });
                    }}
                    style={[
                      styles.productImage,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <Image
                      source={{uri: item.imagem_principal}}
                      resizeMode="contain"
                      style={{width: '100%', height: '100%'}}
                    />
                  </TouchableOpacity>
                  <Text style={styles.productName}> {item.nome} </Text>
                  <Text style={styles.productPrice}>
                    {item.preco}
                    <Text style={{fontSize: SIZES.span}}>AKZ</Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={styles.productWish}>
                      <Text style={{fontSize: SIZES.p, fontWeight: '600'}}>
                        {item.estrelas}
                      </Text>
                      <AntDesign name="star" size={12} color="#ffab00" />
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.dominant,
                        width: 30,
                        height: 30,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => verifyItemsCart(item.id)}>
                      {/* Use o ícone AntDesign e aplique o estilo dinamicamente */}
                      <AntDesign name="plus" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: COLORS.dark}}>
              Ainda não existe produtos disponiveis nesta categoria!
            </Text>
          </View>
        )}
      </ScrollView>
      {isLoading && !showModal && (
        <Loader loadImage={loadImage} loadText={loadText} />
      )}

      {showModal && !isLoading && (
        <Modal
          modalIcon={modalConfig.icon}
          modalTitle={modalConfig.title}
          modalText={modalConfig.text}
          btnClose={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: 'none',
    width: SIZES.width,
    position: 'absolute',
    top: -20,
    left: 0,
    height: 80,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    zIndex: 9,
    paddingHorizontal: 10,
    gap: 10,
  },
  productContainer: {
    padding: 4,
    width: SIZES.width / 2.6,
    height: 220,
    marginTop: 20,
    marginLeft: 15,
    borderRadius: 20,
    overflow: 'hidden', // Garante que a imagem não ultrapasse os limites do contêiner
    backgroundColor: COLORS.background,
    shadowOffset: {
      width: 40,
      height: 40,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowColor: COLORS.shadow,
    elevation: 40,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  productWish: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    color: COLORS.preco,
    fontWeight: '900',
    // marginTop: 8,
    fontSize: SIZES.h6,
  },
  productStars: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#ffcdd2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  productTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
    width: 200,
    overflow: 'hidden',
    height: 100,
    padding: 8,
    backgroundColor: COLORS.background,
    elevation: 10,
    shadowColor: COLORS.dark,
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 10,
    },
  },
  productTopImage: {
    width: '35%',
    height: 'auto',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default Categorias;
