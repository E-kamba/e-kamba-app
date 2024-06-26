import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Alert,
} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, SIZES} from '../Theme';
import {useAuth} from '../Auth';
import {ScrollView} from 'react-native-gesture-handler';

const Perfil = ({navigation}) => {
  const [selectedId, setSelectedId] = useState(1);
  const {userInfo, setUserInfo} = useAuth();
  const [modal, setModal] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const options = [
    {id: 1, name: 'Informações', icon: 'user', pagename: ''},
    {id: 2, name: 'Detalhes', icon: 'info', pagename: ''},
  ];

  const menuItems = [
    {
      id: 1,
      title: 'Editar Perfil',
      icon: 'person-outline', // Nome do ícone se estiver usando uma biblioteca de ícones, como FontAwesome.
      screen: 'Editar', // Nome da tela para navegação.
    },
    {
      id: 2,
      title: 'Pedidos',
      icon: 'list',
      screen: 'Pedidos',
    },
    {
      id: 3,
      title: 'Endereços',
      icon: 'location-outline',
      screen: 'Enderecos',
    },
    {
      id: 4,
      title: 'Carteiras & Metodos de pagamentos',
      icon: 'wallet-outline',
      screen: 'Carteiras',
    },
    {
      id: 5,
      title: 'Preferêcias',
      icon: 'filter-outline',
      screen: 'Preferences',
    },
    {
      id: 6,
      title: 'Política & Privacidade',
      icon: 'lock-closed-outline',
      screen: 'Politica',
    },
    {
      id: 7,
      title: 'Ajuda',
      icon: 'help-circle-outline',
      screen: 'Ajuda',
    },
    {
      id: 8,
      title: 'Sobre',
      icon: 'information-circle-outline',
      screen: 'Sobre',
    },
    {
      id: 9,
      title: 'Sair',
      icon: 'exit-outline',
    },
  ];

  const handleMenuPress = item => {
    if (item.title === 'Sair') {
      return logout();
    } else {
      navigation.navigate(item.screen);
    }
  };

  useEffect(() => {
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

  const logout = async () => {
    await AsyncStorage.removeItem('usuario');
    const user = await AsyncStorage.getItem('usuario');

    if (user) {
    } else {
      navigation.navigate('Splash');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="user" size={28} color={COLORS.dominant} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: SIZES.h5,
            fontWeight: 'bold',
            color: COLORS.dominant,
            marginLeft: -10,
          }}>
          Perfil
        </Text>
      </View>

      {Object.keys(userInfo).length > 0 ? (
        <View style={styles.profileContainer}>
          <View
            style={{
              marginTop: 30,
              paddingVertical: 30,
              paddingHorizontal: 20,
              alignContent: 'flex-start',
              alignItems: 'flex-start',
              // width: SIZES.width,
              flexDirection: 'row',
              gap: 20,
            }}>
            <View style={{position: 'static'}}>
              {userInfo.foto == null ? (
                <Image
                  source={require('../../../assets/user.png')}
                  style={styles.userIcon}
                />
              ) : (
                <Image source={{uri: userInfo.foto}} style={styles.userIcon} />
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                columnGap: 10,
                paddingVertical: 10,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: SIZES.h4}}>
                {userInfo.nome}
              </Text>
              <Text>{userInfo.email}</Text>
            </View>
          </View>

          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            indicatorStyle={{
              width: 4,
            }}
            style={{width: SIZES.width}}>
            <FlatList
              contentContainerStyle={{
                paddingVertical: 0,
              }}
              style={{
                alignSelf: 'center',
                width: SIZES.width - 30,
                paddingVertical: 20,
                paddingHorizontal: 10,
                backgroundColor: COLORS.background,
                shadowOffset: {
                  width: 40,
                  height: 40,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                shadowColor: COLORS.shadow,
                elevation: 40,
                borderRadius: 20,
                marginTop: 0,
              }}
              data={menuItems}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item)}>
                  <Ionicons
                    name={item.icon}
                    size={28}
                    color={COLORS.dominant}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            height: SIZES.height,
          }}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.loginPrompt}>Faça login na sua conta</Text>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.createAccountText}>Entrar</Text>
            <AntDesign name="adduser" size={12} color={COLORS.background} />
          </TouchableOpacity>
          <Text style={styles.orText}>Ou</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>Cadastrar</Text>
            <AntDesign name="adduser" size={12} color={COLORS.dominant} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
    alignItems: 'center',
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
  profileContainer: {
    // width: SIZES.width - 20,
    alignItems: 'center',
    // paddingHorizontal: 20,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: COLORS.garkRgba,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  editButton: {
    position: 'absolute',
    backgroundColor: COLORS.background,
    padding: 4,
    borderRadius: 20,
    right: 0,
    top: 0,
  },
  userInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  userName: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: SIZES.h5,
  },
  userEmail: {
    color: COLORS.background,
    fontSize: SIZES.p,
  },
  optionsList: {
    marginTop: 20,
    paddingHorizontal: 40,
    flexDirection: 'row',
  },
  userDetails: {
    marginTop: 20,
    paddingHorizontal: 40,
    flexDirection: 'column',
  },
  userDetail: {
    opacity: 0.5,
    paddingVertical: 4,
  },
  logo: {
    width: 200,
    height: 200,
  },
  loginPrompt: {
    alignSelf: 'center',
    textAlign: 'center',
    width: SIZES.width / 1.3,
    marginBottom: 10,
    marginTop: 10,
  },
  createAccountButton: {
    backgroundColor: COLORS.dominant,
    borderRadius: 20,
    padding: 10,
    width: 100,
    justifyContent: 'center',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    rowGap: 4,
  },
  createAccountText: {
    color: COLORS.background,
  },
  orText: {
    alignSelf: 'center',
    textAlign: 'center',
    width: SIZES.width / 1.3,
    marginBottom: 10,
    marginTop: 10,
    fontSize: 10,
  },
  registerButton: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
  },
  registerText: {
    color: COLORS.dominant,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.dominant,
  },
});

export default Perfil;
