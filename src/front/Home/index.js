import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useRoute,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  Pressable,
  Alert,
  Animated,
  Linking,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {
  AntDesign,
  Feather,
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import {FlatList, ScrollView} from 'react-native';
import axios from 'axios';
import {COLORS, SIZES} from '../Theme';
import 'react-native-gesture-handler';
import {db} from '../../back/database';
import Headergeral from '../layouts/header';
import SlideComponent from '../Components/Slider';
import Modal from '../Components/Modal';
import Loader from '../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../Auth';

export default function HomeScreen({navigation}) {
  const {
    produtos,
    setProdutos,
    userInfo,
    setUserInfo,
    cartData,
    setCartData,
    cartItems,
    setCartItems,
    userId,
    userName,
    userEmail,
    userPhoto,
    setUserId,
    setUserName,
    setUserPhoto,
    categorias,
    preferences,
    notifications,
    setNotifications
  } = useAuth();
  const produtosTop = produtos.filter(i => i.estrelas > 3.5);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoriaF, setCategoriaF] = useState(false);
  const productFiltTop = produtos.filter(i => i.estrelas > 3.5);
  const [productLimit, setProductLimit] = useState(30);
  const [modalConfig, setModalConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalBtn, setModalBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let loadImage = require('../../../assets/loadicon-1.gif');
  const [loadText, setloadText] = useState('');
  const [selectedItem, setSelectedItem] = useState(1);
  // const defaultUserPhoto = require("../../../assets/user.png");

  const sections = [
    {id: 1, label: 'Produtos'},
    {id: 2, label: 'Categorias'},
  ];

  const changeSection = id => {
    setSelectedItem(id);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('usuario');
      if (user) {
        const userData = JSON.parse(user);
        const {id, nome, email, foto} = userData;
        setUserId(id);
        setUserName(nome);
        setUserPhoto(foto);
        setUserInfo(userData);
      } else {
        console.log('Nenhum dado do usuário encontrado.');
      }
    } catch (error) {
      console.error('Erro ao obter os dados do usuário:', error);
      // Lidar com o erro de forma apropriada, como exibir uma mensagem de erro para o usuário
    }
  };

  const redirectToLogin = () => {
    setModalBtn(false);
    navigation.navigate('Login');
  };

  const verifyUserData = async product => {
    if (Object.keys(userInfo).length > 0) {
      verifyItemsCart(product);
    } else {
      let modalConfig = {};

      modalConfig = {
        icon: 'person-outline',
        title: 'Crie uma conta!',
        text: 'Crie uma conta para adicionar seu produto ao carrinho!',
      };
      setModalBtn(true);
      setShowModal(true);
      setModalConfig(modalConfig);
    }
  };

  const verifyItemsCart = async product => {
    try {
      const cartData = await AsyncStorage.getItem('carrinho');
      const dataCart = cartData ? JSON.parse(cartData) : [];

      const checkItem = dataCart.find(item => item.id === product.id);
      let modalConfig = {};

      if (checkItem) {
        modalConfig = {
          icon: 'error-outline',
          title: 'Erro ao adicionar ao carrinho',
          text: 'Este item já foi adicionado ao carrinho.',
        };
      } else {
        await addToCart(product, dataCart);
        modalConfig = {
          icon: 'check-circle-outline',
          title: 'Item adicionado',
          text: 'O item foi adicionado ao carrinho com sucesso.',
        };
      }

      setShowModal(true);
      setModalConfig(modalConfig);
    } catch (error) {
      console.error('Erro ao verificar itens no carrinho:', error);
      setShowModal(true);
      setModalConfig({
        icon: 'error-outline',
        title: 'Erro',
        text: 'Ocorreu um erro ao verificar o carrinho. Por favor, tente novamente.',
      });
    }
  };

  const addToCart = async (product, newData) => {
    try {
      newData.push({product});

      await AsyncStorage.setItem('carrinho', JSON.stringify(newData));
      setCartData(newData);
      continueAddItem(product.id);
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Perfil');
            }}>
            {userInfo.foto == null ? (
              <Image
                source={require('../../../assets/user.png')}
                style={styles.userImage}
              />
            ) : (
              <Image source={{uri: userPhoto}} style={styles.userImage} />
            )}
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
            }}>
            <Text style={styles.leftContentTextOne}>
              Olá{' '}
              {Object.keys(userInfo).length !== 0
                ? userInfo.nome.split(' ')[0]
                : ''}
              !👋
            </Text>
            <Text style={styles.leftContentTextTwo}>
              Explore as tendências de hoje...
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}>
          <TouchableOpacity
            style={styles.cart}
            onPress={() => {
              navigation.navigate('Search', {products: cartData});
            }}>
            <Feather name="search" size={20} color={COLORS.title} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cart}
            onPress={() => {
              navigation.navigate('Notificacoes', {products: cartData});
            }}>
            {Object.keys(notifications).length !== 0 ? (
              <Text style={styles.cartLength}>{cartData.length}</Text>
            ) : (
              <></>
            )}
            <Feather name="bell" size={20} color={COLORS.title} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
          padding: 4,
        }}>
        {sections.map(item => {
          return (
            <TouchableOpacity
              onPress={() => changeSection(item.id)}
              style={{
                borderBottomWidth: selectedItem === item.id ? 2 : 0,
                borderColor: COLORS.dominant,
                padding: 12,
              }}>
              <Text
                style={{
                  color: COLORS.dominant,
                  fontWeight: 'bold',
                  fontSize: SIZES.h6,
                  opacity: selectedItem === item.id ? 1 : 0.5,
                }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView scrollEnabled>
        {/* feactures */}

        {selectedItem === 1 ? (
          <>
            <SlideComponent />
            <View
              style={{
                flex: 1,
              }}>
              {/* produtos popular */}
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 8,
                  paddingHorizontal: 20,
                  // gap: SIZES.width / 3.8,
                  paddingVertical: 8,
                }}>
                <Text
                  style={{
                    fontSize: SIZES.h5,
                    fontWeight: 'bold',
                  }}>
                  Produtos popular
                </Text>
                {/* btn ver mais */}
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: SIZES.h6,
                      fontWeight: 'normal',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      opacity: 0.7,
                    }}>
                    Ver todos
                  </Text>
                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color="black"
                    style={{
                      opacity: 0.7,
                    }}
                  />
                </TouchableOpacity>
              </View>
              {/* produtos popular */}
              <FlatList
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  gap: 20,
                  // width: SIZES.width,
                  // height: 180,
                }}
                contentContainerStyle={{padding: 10}}
                horizontal={true}
                scrollIndicatorInsets
                data={productFiltTop.slice(0, 15)}
                keyExtractor={(item, index) => index.toString()} // Adicionando keyExtractor
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Produto', {
                          produto: item,
                        });
                      }}
                      style={styles.productTopContainer}>
                      <View style={styles.productTopImage}>
                        <Image
                          source={{uri: item.imagem_principal}}
                          resizeMode="contain"
                          style={{width: '100%', height: '100%'}}
                        />
                      </View>
                      <View>
                        <Text style={styles.productName}> {item.nome} </Text>
                        <Text style={styles.productPrice}>
                          {item.preco.toFixed(2)}
                          <Text style={{fontSize: SIZES.span}}>AKZ</Text>
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={styles.productWish}>
                            <Text
                              style={{fontSize: SIZES.p, fontWeight: '600'}}>
                              {item.estrelas}
                            </Text>
                            <AntDesign name="star" size={12} color="#ffab00" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Todos os produtos */}
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 8,
                  paddingHorizontal: 20,
                  // gap: SIZES.width / 3.8,
                  paddingVertical: 8,
                }}>
                <Text
                  style={{
                    fontSize: SIZES.h5,
                    fontWeight: 'bold',
                  }}>
                  Super descontos
                </Text>
                {/* btn ver mais */}
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: SIZES.h6,
                      fontWeight: 'normal',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      opacity: 0.7,
                    }}>
                    Ver todos
                  </Text>
                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color="black"
                    style={{
                      opacity: 0.7,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal={true}
                style={{
                  width: '100%',
                  paddingTop: 0,
                  paddingLeft: 0,
                  paddingBottom: 40,
                }}
                contentContainerStyle={{
                  padding: 8,
                }}
                // numColumns={2}
                data={produtos.slice(0, 10)}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.productContainerOfertas}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Produto', {
                            produto: item,
                          });
                        }}
                        style={[
                          styles.productImageOfertas,
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
                        {item.preco.toFixed(2)}
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
                          onPress={() => verifyUserData(item)}>
                          {/* Use o ícone AntDesign e aplique o estilo dinamicamente */}
                          {/* <AntDesign name="plus" size={20} color="white" /> */}
                          <Image
                            source={require('../../../assets/cart-arrow-down.png')}
                            resizeMode="contain"
                            style={{
                              width: 18,
                              height: 18,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />

              {/* Todos os produtos */}
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 8,
                  paddingHorizontal: 20,
                  // gap: SIZES.width / 3.8,
                  paddingVertical: 8,
                }}>
                <Text
                  style={{
                    fontSize: SIZES.h5,
                    fontWeight: 'bold',
                  }}>
                  Todos os produtos
                </Text>
                {/* btn ver mais */}
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {/* <Text
                    style={{
                      fontSize: SIZES.h6,
                      fontWeight: "normal",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      opacity: 0.7,
                    }}
                  >
                    Ver todos
                  </Text>
                  <Entypo
                    name="chevron-small-right"
                    size={24}
                    color="black"
                    style={{
                      opacity: 0.7,
                    }}
                  /> */}
                </TouchableOpacity>
              </View>
              <FlatList
                style={{
                  width: '100%',
                  paddingTop: 0,
                  paddingLeft: 0,
                  paddingBottom: 40,
                }}
                contentContainerStyle={{
                  padding: 8,
                }}
                numColumns={2}
                data={produtos.slice(0, 30)}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.productContainer}>
                      <TouchableOpacity
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
                        {item.preco.toFixed(2)}
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
                          onPress={() => verifyUserData(item)}>
                          {/* Use o ícone AntDesign e aplique o estilo dinamicamente */}
                          {/* <AntDesign name="shoppingcart" size={20} color="white" /> */}
                          <Image
                            source={require('../../../assets/cart-arrow-down.png')}
                            resizeMode="contain"
                            style={{
                              width: 18,
                              height: 18,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </>
        ) : (
          <>
            <ScrollView>
              <FlatList
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  width: '100%',
                }}
                contentContainerStyle={{
                  padding: 10,
                }}
                showsVerticalScrollIndicator
                data={categorias.slice(1, 13)}
                renderItem={({item, index}) => {
                  const isSelected = categoryIndex === index;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCategoryIndex(index);
                        setCategoriaF(item.id);
                        navigation.navigate('Categoria', {
                          id: item.id,
                          categoria: item.categoria,
                          image: item.image,
                        });
                      }}
                      style={{
                        width: SIZES.width - 16,
                        height: 200,
                        flexDirection: 'column',
                        columnGap: 10,
                        backgroundColor: COLORS.background,
                        // padding: 8,
                        overflow: 'hidden',
                        borderRadius: 10,
                        marginTop: 4,
                        textAlign: 'center',
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        shadowColor: '#b0bec5',
                        shadowOffset: {
                          width: 10,
                          height: 10,
                        },
                        elevation: 8,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: isSelected
                          ? COLORS.title
                          : COLORS.background,
                      }}>
                      <Image
                        source={item.image}
                        // resizeMode="contain"
                        style={{width: '100%', height: '100%'}}
                      />

                      <View
                        style={{
                          position: 'absolute',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '100%',
                          height: '100%',
                          backgroundColor: COLORS.darkOpacity,
                          flexDirection: 'column',
                        }}>
                        <Ionicons
                          style={{alignSelf: 'center'}}
                          name={item.icon}
                          size={60}
                          color={COLORS.background}
                        />
                        <Text
                          style={{
                            color: COLORS.background,
                            // display: isSelected ? "flex" : "none",
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: SIZES.h5,
                            marginTop: 10,
                          }}>
                          {item.categoria}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
              />
            </ScrollView>
          </>
        )}
      </ScrollView>

      {/* {filterOpen !== false ? (
        <View
          style={{
            position: "absolute",
            zIndex: 9,
            width: SIZES.width,
            height: SIZES.height,
            backgroundColor: COLORS.darkOpacity,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setFilterOpen(false);
            }}
            style={{
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <AntDesign name="close" size={24} color={COLORS.background} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.background,
              width: SIZES.width,
              height: SIZES.height / 3,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          ></View>
        </View>
      ) : (
        <></>
      )} */}

      {isLoading && !showModal && (
        <Loader loadImage={loadImage} loadText={loadText} />
      )}

      {showModal && !isLoading && (
        <Modal
          modalIcon={modalConfig.icon}
          modalTitle={modalConfig.title}
          modalText={modalConfig.text}
          btnClose={closeModal}
          modalBtn={modalBtn}
          event={redirectToLogin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    width: SIZES.width,
    height: SIZES.height,
  },

  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 0,
    // marginTop: 15,
    justifyContent: 'space-between',
  },
  userImage: {width: 40, height: 40, borderRadius: 30},

  logo: {
    position: 'absolute',
    top: 0,
    // width: "100%",
    height: 80,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  leftContentTextOne: {
    fontSize: SIZES.h5,
    fontWeight: '700',
  },
  leftContentTextTwo: {
    opacity: 0.3,
    fontWeight: 'bold',
    fontSize: SIZES.span,
  },
  cart: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
  },
  cartLength: {
    position: 'absolute',
    top: -5,
    left: 25,
    backgroundColor: COLORS.title,
    color: '#fff',
    fontSize: SIZES.span,
    fontWeight: '600',
    padding: 2,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  search: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    // paddingVertical: 4,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#bcaaa4',
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 30,
    gap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },

  searchFilter: {
    backgroundColor: COLORS.title,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  productContainer: {
    padding: 8,
    width: SIZES.width / 2.4,
    height: 230,
    marginTop: 15,
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
  productContainerOfertas: {
    padding: 8,
    width: SIZES.width / 1.9,
    height: 288,
    marginTop: 15,
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

  productTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
    width: 220,
    overflow: 'hidden',
    height: 120,
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
    width: '40%',
    height: 'auto',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  productImageOfertas: {
    width: '100%',
    height: 200,
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

  filtro: {
    position: 'absolute',
    zIndex: 9,
  },
});
