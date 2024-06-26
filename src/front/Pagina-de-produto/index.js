import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
  Button,
  TextInput,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {useRoute} from '@react-navigation/native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {db} from '../../back/database';
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
import {useAuth} from '../Auth';
import WebView from 'react-native-webview';
// import {Video, AVPlaybackStatus} from 'expo-av';

export default function ProdutoScreen({navigation}) {
  const fotoPerfil = require('../../../assets/user-foto1.png');
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const route = useRoute();
  const produto = route.params?.produto;
  const produtoColors = produto.colors;
  const [produtoCategoria, setProdutoCategoria] = useState('');
  const categoriaId = produto.categoria;
  const [quantity, setQuantity] = useState(1); // Estado para armazenar as quantidades individuais
  const {categorias} = useAuth();
  const [selectedImage, setSelectedImage] = useState(produto.imagem_principal);
  const [newComment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setdisLiked] = useState(false);

  const categoriaAtual = categorias.find(item => item.id === categoriaId);

  const coments = [
    {
      id: 1,
      foto: null,
      name: 'Pedro Domingos',
      email: 'pedrodomingos@gmail.com',
      coment: 'Excelente produto!',
      like: true,
      noLike: false,
    },
    {
      id: 2,
      foto: null,
      name: 'António',
      email: 'antonio@gmail.com',
      coment: 'Gostei do produto!',
      like: true,
      noLike: false,
    },
  ];

  const totalLikes = coments.reduce(
    (acc, item) => acc + (item.like ? 1 : 0),
    0,
  );
  const totalDislikes = coments.reduce(
    (acc, item) => acc + (item.noLike ? 1 : 0),
    0,
  );

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity; // Se a quantidade for 1 ou menos, não altera o estado
    });
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
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

  const processPayment = product => {
    let productInfo = [];

    productInfo.push({
      idProduto: product.id,
      quantidade: quantity,
      preco: product.preco,
      nome: product.nome,
      imagem: product.imagem_principal,
    });

    navigation.navigate('Checkout', {product: productInfo});
  };

  const likeItem = () => {
    setLiked(prev => {
      const newLiked = !prev;
      if (newLiked) {
        setdisLiked(false);
      }
      return newLiked;
    });
  };

  const dislikeItem = () => {
    setdisLiked(prev => {
      const newDisliked = !prev;
      if (newDisliked) {
        setLiked(false);
      }
      return newDisliked;
    });
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleBackButtonClick();
          }}>
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
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
      <View style={styles.image}>
        <Image
          source={{uri: selectedImage}}
          resizeMode="contain"
          style={{width: '80%', height: '80%'}}
        />
        <View
          style={{
            width: 100,
            height: '80%',
            right: 10,
            // backgroundColor: "none",
            position: 'absolute',
            padding: 10,
          }}>
          {JSON.parse(produto.imagens).map((link, index) => (
            <TouchableOpacity
              style={{
                width: 80,
                height: 60,
                borderRadius: 20,
                borderWidth: 2,
                borderColor:
                  selectedImage === link ? COLORS.dominant : 'transparent', // Changed 'none' to 'transparent' for valid CSS
                overflow: 'hidden',
                flexDirection: 'column',
                marginTop: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  selectedImage === link ? COLORS.light : 'white', // Added background color for selected state
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}
              key={index}
              onPress={() => setSelectedImage(link)}>
              <Image
                source={{uri: link}}
                style={{width: 80, height: 80, borderRadius: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.text}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          contentContainerStyle={{paddingBottom: 20}}
          style={{
            marginBottom: 60,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: '#f5f5f5',
              borderBottomWidth: 1,
              justifyContent: 'space-between',
              // width:
            }}>
            <View
              style={
                {
                  // width: '70%',
                }
              }>
              <Text style={styles.categoria}> {categoriaAtual.categoria} </Text>
              <Text style={styles.title}> {produto.nome} </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View>
                  <Text style={styles.preco}>{produto.preco} AKZ</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text> {produto.estrelas} </Text>
              <AntDesign name="star" size={16} color="#ffab00" />
            </View>
          </View>
          <View style={styles.descricao}>
            <View>
              <Text style={{fontSize: SIZES.h4}}>Descriçao </Text>
              <Text style={{fontSize: SIZES.p, marginTop: 4, opacity: 0.7}}>
                {produto.descricao}
              </Text>
            </View>
          </View>
          <View style={styles.descricao}>
            <View style={{width: SIZES.width}}>
              <Text style={{fontSize: SIZES.h4}}>Cores </Text>
              {produto.cores === null ? (
                <>
                  <Text style={{fontSize: SIZES.p, marginTop: 4, opacity: 0.7}}>
                    Cor unico
                  </Text>
                </>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {JSON.parse(produto.cores).map((item, index) => (
                    <>
                      <View
                        key={index}
                        style={[
                          styles.colorCircle,
                          {backgroundColor: item.hex},
                          index === produto.cores.length - 1
                            ? {marginRight: 0}
                            : null, // remove marginRight for the last item
                        ]}
                      />
                      <Text
                        style={{
                          fontSize: SIZES.h5,
                          marginTop: 4,
                          opacity: 0.7,
                        }}>
                        {item.nome}
                      </Text>
                    </>
                  ))}
                </View>
              )}
            </View>
            <View style={{width: SIZES.width, marginVertical: 20}}>
              <Text style={{fontSize: SIZES.h4}}>Tamanhos </Text>
              {produto.cores === null ? (
                <>
                  <Text style={{fontSize: SIZES.p, marginTop: 4, opacity: 0.7}}>
                    Tamanho unico
                  </Text>
                </>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    // justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {JSON.parse(produto.tamanhos).map((item, index) => (
                    <>
                      <View
                        key={index}
                        style={{
                          backgroundColor: item.hex,
                          width: 30,
                          height: 30,
                          borderRadius: 4,
                          marginRight: 0, // add margin right to space out the circles
                          marginTop: 10,
                          borderWidth: 1.5,
                          borderColor: COLORS.darkOpacity,
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor: COLORS.vibrant,
                        }}>
                        <Text
                          style={{
                            fontSize: SIZES.h5,
                            // marginTop: 4,
                            color: COLORS.background,
                            opacity: 0.7,
                          }}>
                          {item.nome}
                        </Text>
                      </View>
                    </>
                  ))}
                </View>
              )}
            </View>
          </View>
          <WebView
            ref={videoRef}
            style={styles.webview}
            source={{uri: produto.video}}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback
          />
          {/* <Video
            source={{uri: produto.videos}}
            style={styles.webview}
            allowsInlineMediaPlayback={true}
            containerStyle={{
              // padding: 10,
              marginTop: 20,
              borderRadius: 20,
              opacity: 1,
            }}
          /> */}

          <View style={{paddingVertical: 20}}>
            <Text style={{padding: 10, fontSize: SIZES.h5, fontWeight: 'bold'}}>
              Comentários sobre o produto?
            </Text>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <Text style={{padding: 10}}>
                <Text style={{fontWeight: 'bold'}}>{coments.length} </Text>
                Comentários
              </Text>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Text>Gostos</Text>
                  <AntDesign
                    name={totalLikes > 0 ? 'like1' : 'like2'}
                    color={COLORS.dominant}
                    size={24}
                  />
                  <Text>{totalLikes}</Text>
                  <AntDesign
                    name={totalDislikes > 0 ? 'dislike1' : 'dislike2'}
                    color={COLORS.dominant}
                    size={24}
                  />
                  <Text>{totalDislikes}</Text>
                </View>
              </View>
            </View>

            <View style={{marginTop: 20, flexDirection: 'column', gap: 20}}>
              {coments.map((item, index) => {
                return (
                  <>
                    <View style={{flexDirection: 'row', gap: 10}}>
                      <Image
                        source={item.foto ? {uri: item.foto} : fotoPerfil}
                        style={{width: 50, height: 50, borderRadius: 50}}
                      />
                      <View>
                        <Text style={{fontWeight: 'bold', fontSize: SIZES.h5}}>
                          {item.name}
                        </Text>
                        <Text style={{opacity: 0.3, marginTop: -8}}>
                          {item.email}
                        </Text>
                        <Text>{item.coment}</Text>
                      </View>
                    </View>
                  </>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={{padding: 10, fontSize: SIZES.h5, fontWeight: 'bold'}}>
              Deixe sua avaliação
            </Text>
            <View>
              {/* <Text style={styles.label}>Comentário</Text> */}
              <View style={styles.input}>
                <TextInput
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                  }}
                  placeholder="Comentário..."
                  onChange={data => setComment(data)}
                />
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.dominant,
                    padding: 8,
                    width: 160,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    marginTop: 10,
                  }}>
                  <Text style={{color: COLORS.background}}>
                    Enviar comentário
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <TouchableOpacity onPress={likeItem}>
                    <AntDesign
                      name={liked == false ? 'like2' : 'like1'}
                      color={COLORS.dominant}
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={dislikeItem}>
                    <AntDesign
                      name={disliked == false ? 'dislike2' : 'dislike1'}
                      color={COLORS.dominant}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* btn add cart */}
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            padding: 4,
            paddingHorizontal: 10,
            backgroundColor: COLORS.background,
          }}>
          <View
            style={{
              width: SIZES.width,
              paddingHorizontal: 20,
              flexDirection: 'row',
              padding: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.023)',
              // gap: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              borderRadius: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 4,
              }}>
              <TouchableOpacity
                style={{
                  color: '#fff',
                  backgroundColor: 'none',
                  borderRadius: 20,
                  marginRight: 10,
                }}
                onPress={() => decreaseQuantity(produto.id)}>
                <Text style={{fontSize: SIZES.h2}}>-</Text>
              </TouchableOpacity>
              <Text> {quantity} </Text>
              <TouchableOpacity
                style={{
                  color: '#fff',
                  borderRadius: 20,
                  marginLeft: 10,
                }}
                onPress={() => increaseQuantity(produto.id)}>
                <Text style={{fontSize: SIZES.h2}}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => processPayment(produto)}
              style={{
                backgroundColor: COLORS.title,
                borderRadius: 20,
                width: 'auto',
                flex: 1,
                flexDirection: 'row',
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                paddingHorizontal: 20,
              }}>
              <MaterialIcons name="payment" color="#fff" size={24} />
              <Text style={{color: '#fff', fontSize: SIZES.h6}}>
                Comprar Agora
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffa',
    // justifyContent: "center",
    // alignItems: "center",
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
    gap: SIZES.width / 1.3,
    zIndex: 9,
    paddingHorizontal: 10,
  },
  image: {
    position: 'absolute',
    top: 0,
    width: SIZES.width,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  text: {
    width: '100%',
    height: SIZES.height / 1.7,
    position: 'absolute',
    bottom: 0,
    padding: 20,
    backgroundColor: '#fff',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowColor: '#7575',
    elevation: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: SIZES.h3,
  },
  categoria: {
    fontStyle: 'italic',
    opacity: 0.5,
  },
  preco: {
    // width: '40%',
    color: COLORS.preco,
    fontWeight: '900',
    fontSize: SIZES.h5,
  },
  descricao: {
    flexDirection: 'column',
    paddingVertical: 10,
    fontSize: SIZES.h5,
  },
  webview: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 0, // add margin right to space out the circles
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: COLORS.darkOpacity,
  },
  input: {
    padding: 8,
    height: 100,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#e1f5fe',
    paddingLeft: 10,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-start',
    // borderWidth: 1
  },

  label: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.dark,
    opacity: 0.4,
  },
});
