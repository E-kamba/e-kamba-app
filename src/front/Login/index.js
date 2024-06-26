import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TextInput, Alert} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {TouchableOpacity} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import axios from 'axios';
import background from '../../../assets/slide-2.jpg';
import {db} from '../../back/database';
import Header from '../layouts/header';
import Loader from '../Components/Loader';
import Modal from '../Components/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {Camera, CameraType} from 'expo-camera';
import userDefaultPhoto from '../../../assets/user.png';
import {useAuth} from '../Auth';

export default function LoginScreen({navigation}) {
  const {userInfo, setUserInfo} = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);
  const [senha, setSenha] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalIcon, setModalIcon] = useState('error-outline');
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');
  const [passwordIcon, setPasswordIcon] = useState('eye-outline');
  const [showPassword, setShowPassword] = useState(true);
  const [title, setTitle] = useState('Bem-vindo de volta,');
  const [text, setText] = useState(
    'estamos muito felizes por ve-lo novamente. Insira o seu e-mail e senha...',
  );
  let loadImage = require('../../../assets/loadicon-1.gif');
  const [loadText, setloadText] = useState('Fazendo login na sua conta!');

  async function sendLogin() {
    if (email != null && senha != null) {
      handleLogin(email, senha);
    } else {
      setErrorMessage('Preencha todos os campos!');
    }
  }

  async function sendSignUp() {
    if (nome && email && senha) {
      try {
        setIsLoading(true);
        setloadText('Criando uma conta para você!');
        const response = await axios.post('https://appdist.qml.ao/r3g1str0', {
          nome,
          email,
          senha,
        });

        if (response.status === 200) {
          const data = await response.data[0];
          saveUserData(data);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setShowModal(true);
          setModalTitle('Registro');
          setModalText('Erro ao se registrar. ' + error.response.data.mensagem);
        } else {
          console.error('Erro ao se comunicar com o servidor:', error);
          setShowModal(true);
          setModalTitle('Registro');
          setModalText('Ocorreu um erro ao se comunicar com o servidor.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Preencha todos os campos!');
      setIsLoading(false); // Certifique-se de definir o isLoading como falso também quando há erro
    }
  }

  const saveUserData = async userData => {
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(userData));
      const user = await AsyncStorage.getItem('usuario');
      if (user) {
        setUserInfo(userData);
        getPreferences();
      } else {
        console.error('Erro ao salvar os dados do usuário no AsyncStorage.');
        // Lidar com o erro de forma apropriada, como exibir uma mensagem de erro para o usuário
      }
    } catch (error) {
      console.error('Erro ao salvar os dados do usuário:', error);
      // Lidar com o erro de forma apropriada, como exibir uma mensagem de erro para o usuário
    }
  };

  const obterImagem = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    setOpen(false);
  };

  const acessarGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    setOpen(false);
  };

  const togglePassword = () => {
    const newShowPassword = !showPassword;
    setShowPassword(newShowPassword);
    setPasswordIcon(newShowPassword ? 'eye-outline' : 'eye-off-outline');
  };

  const passwordRecover = () => {};

  const continueRegister = () => {};

  const getPreferences = async () => {
    const data = await AsyncStorage.getItem('preferences');
    if (data) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Preferences');
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setloadText('Fazendo login na sua conta!');
      const response = await axios.post('https://appdist.qml.ao/login', {
        email,
        senha,
      });

      if (response.status === 200) {
        const data = await response.data[0];
        saveUserData(data);
      } else {
        throw new Error('Erro ao fazer login. Verifique a sua internet!');
      }
    } catch (error) {
      let errorMessage =
        'Ocorreu um erro durante o login. Tente novamente mais tarde.';

      if (error.response) {
        if (error.response.status === 401) {
          setIsLoading(false);
          errorMessage = 'Senha incorreta!';
        } else {
          errorMessage = `Erro de login: ${error.response.data.mensagem}`;
        }
      } else {
        console.error('Erro de login:', error);
      }

      setIsLoading(false);
      setShowModal(true);
      setModalTitle('Login');
      setModalText(errorMessage);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {step1 === true ? (
        <View style={styles.content}>
          {/* <Header /> */}
          {!isLogin == false ? (
            // form login
            <View style={styles.formsContainer}>
              <Image
                source={require('../../../assets/5365626.jpg')}
                style={{
                  width: SIZES.width,
                  height: SIZES.height / 2,
                  position: 'absolute',
                }}
              />
              <View style={styles.form}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: SIZES.width,
                  }}>
                  <Text style={styles.titlePrincipal}>{title}</Text>
                  <Text style={styles.textPrincipal}>{text}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="email@exemplo.com"
                    onChangeText={data => {
                      setEmail(data);
                    }}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.input}>
                    <TextInput
                      style={{width: '90%'}}
                      placeholder=""
                      onChangeText={data => {
                        setSenha(data);
                      }}
                      secureTextEntry={showPassword}
                    />
                    <TouchableOpacity
                      style={{padding: 4}}
                      onPress={togglePassword}>
                      <Ionicons name={passwordIcon} size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={passwordRecover}
                  style={{marginTop: 10}}>
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      color: '#0288d1',
                    }}>
                    Esqueceu - se da sua senha ?
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.btn_signIn}
                    onPress={data => {
                      sendLogin(data);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                      Entrar
                    </Text>
                    <AntDesign name="login" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsLogin(false);
                      setTitle('Crie uma conta,');
                      setText(
                        'isso levará poucos minutos. Insira o seu nome, e-mail e senha...',
                      );
                      setErrorMessage('');
                    }}
                    style={styles.btn_signUp}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: COLORS.darkOpacity,
                      }}>
                      Criar uma conta
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.alerta,
                      fontSize: SIZES.p,
                      // marginLeft: 4,
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    {errorMessage}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            // form login
            <View style={styles.formsContainer}>
              <Image
                source={require('../../../assets/5365626.jpg')}
                style={{
                  width: SIZES.width,
                  height: SIZES.height / 2,
                  position: 'absolute',
                }}
              />
              <View style={styles.form}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: SIZES.width,
                  }}>
                  <Text style={styles.titlePrincipal}>{title}</Text>
                  <Text style={styles.textPrincipal}>{text}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="primeiro e ultmo nome"
                    onChangeText={data => {
                      setNome(data);
                    }}
                  />
                </View>
                <View style={{marginTop: 8}}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="email@exemplo.com"
                    onChangeText={data => {
                      setEmail(data);
                    }}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.label}>Senha</Text>
                  <View style={styles.input}>
                    <TextInput
                      style={{width: '90%'}}
                      placeholder=""
                      onChangeText={data => {
                        setSenha(data);
                      }}
                      secureTextEntry={showPassword}
                    />
                    <TouchableOpacity
                      style={{padding: 4}}
                      onPress={togglePassword}>
                      <Ionicons name={passwordIcon} size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    style={styles.btn_signIn}
                    onPress={data => {
                      sendSignUp(data);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                      Registrar
                    </Text>
                    <AntDesign name="user" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setTitle('Bem-vindo de volta');
                      setText(
                        'estamos muito felizes por ve-lo novamente. Insira o seu e-mail e senha...',
                      );
                      setIsLogin(true);
                      setErrorMessage('');
                    }}
                    style={styles.btn_signUp}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: COLORS.darkOpacity,
                      }}>
                      Já tenho uma conta
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.alerta,
                      fontSize: SIZES.p,
                      // marginLeft: 4,
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    {errorMessage}
                  </Text>
                </View>
              </View>
            </View>
            // form cadastro
          )}
        </View>
      ) : (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View>
            <Text style={styles.titlePrincipal}>Edite o seu perfil</Text>
          </View>
          <TouchableOpacity
            style={{
              width: 200,
              height: 200,
              backgroundColor: COLORS.dark,
            }}></TouchableOpacity>
        </View>
      )}
      {isLoading === false ? (
        <></>
      ) : (
        <Loader loadImage={loadImage} loadText={loadText} />
      )}
      {showModal === false ? (
        <></>
      ) : (
        <Modal
          modalIcon={modalIcon}
          modalTitle={modalTitle}
          modalText={modalText}
          btnClose={closeModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
    height: SIZES.height,
    flexDirection: 'column',
    flexGrow: 1,
  },

  header: {
    position: 'relative',
    top: 0,
    zIndex: 9,
    backgroundColor: 'none',
  },

  titlePrincipal: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'left',
    paddingBottom: 10,
    color: COLORS.dominant,
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  textPrincipal: {
    fontFamily: 'Helvetica',
    fontSize: SIZES.p,
    // fontWeight: "bold",
    width: '100%',
    textAlign: 'left',
    paddingBottom: 50,
    color: COLORS.dark,
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    marginTop: -8,
    opacity: 0.5,
  },
  content: {
    backgroundColor: COLORS.background,
    width: SIZES.width,
    bottom: 0,
    position: 'absolute',
    // height: SIZES.height - 200,
    overflow: 'hidden',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'flex-end',
    // elevation: 50,
    // shadowColor: COLORS.dark,
  },

  sectionTitle: {
    fontSize: SIZES.h4,
    color: COLORS.dominant,
    fontWeight: '900',
    textAlign: 'left',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: COLORS.vibrant,
    borderBottomWidth: 2,
    marginBottom: 20,
    width: '40%',
  },
  bck: {
    width: SIZES.width,
    height: SIZES.height,
  },
  logo: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 80,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  formsContainer: {
    width: SIZES.width,
    height: SIZES.height,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  form: {
    width: '100%',
    padding: 20,
    height: 'auto',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 40,
    // justifyContent: "space-around",
  },
  input: {
    padding: 8,
    height: 50,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#e1f5fe',
    paddingLeft: 10,
    borderRadius: 25,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },

  label: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.dark,
    opacity: 0.4,
  },
  btn_signIn: {
    backgroundColor: COLORS.vibrant,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.background,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    flexDirection: 'row',
    gap: 5,
  },
  btn_signUp: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 5,
    shadowColor: COLORS.background,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  image: {
    width: 105,
    height: 105,
    backgroundColor: '#121212',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
