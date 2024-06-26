import React, {useState, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
  SafeAreaView,
  Image,
} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {useAuth} from '../../Auth';
import {SIZES, COLORS} from '../../Theme';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const Editar = ({navigation}) => {
  const [modal, setShowModal] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const {userInfo, setUserInfo} = useAuth();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [passwordIcon, setPasswordIcon] = useState('eye-outline');
  const [showPassword, setShowPassword] = useState(true);
  const [password, setPassword] = useState(null);
  const [gender, setGender] = useState(null);
  const [phone, setPhone] = useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [genero, setGenero] = useState([
    {label: 'Masculino', value: 'masculino'},
    {label: 'Feminino', value: 'feminino'},
  ]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const togglePassword = () => {
    const newShowPassword = !showPassword;
    setShowPassword(newShowPassword);
    setPasswordIcon(newShowPassword ? 'eye-outline' : 'eye-off-outline');
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
    return true;
  };

  const uploadPerfilFoto = async foto => {
    try {
      setIsLoading(true);

      const photoName = foto.split('/').pop();
      const imageType = foto.split('.').pop(); // Extrai a extensão da imagem

      const formData = new FormData();
      formData.append('images', {
        uri: foto, // Use 'foto' diretamente aqui
        type: `image/${imageType}`, // Determina dinamicamente o tipo da imagem
        name: photoName,
      });

      // Usar await para aguardar a resolução da Promise retornada por axios.post
      const response = await axios.post(
        'https://appdist.qml.ao/uploadUserPhoto',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Verificar o status da resposta dentro de um bloco try...catch
      if (response.status === 200) {
        const data = response.data;
        const path = data.uploadedFiles[0].path;
        await saveUserPhoto(path);
      } else {
        console.error('Erro ao salvar imagem!');
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acessarGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const photoUri = result.assets[0].uri;
      setImageUri(photoUri);
      await uploadPerfilFoto(photoUri);
    }
  };

  const saveUserPhoto = async photoPath => {
    try {
      const {id} = userInfo;

      const response = await axios.post(
        'https://appdist.qml.ao/saveUserPhoto',
        {
          foto: photoPath,
          idUsuario: id,
        },
      );

      if (response.status === 200) {
        console.log('Foto de perfil salva com sucesso!');
      } else {
        console.error('Erro ao salvar foto de perfil no servidor!');
      }
    } catch (error) {
      console.error('Erro ao salvar foto de perfil:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleOpenGender = () => {
    setOpen1(prevOpen => !prevOpen);
  };

  console.log(userInfo);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" color={COLORS.dominant} size={28} />
        </TouchableOpacity>
        <AntDesign name="edit" color={COLORS.dominant} size={28} />
        <Text
          style={{
            fontSize: SIZES.h5,
            fontWeight: 'bold',
            color: COLORS.dominant,
            marginLeft: -10,
          }}>
          Editar Perfil
        </Text>
      </View>
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
                source={require('../../../../assets/user.png')}
                style={styles.userIcon}
              />
            ) : (
              <Image source={{uri: userInfo.foto}} style={styles.userIcon} />
            )}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: -10,
                borderRadius: 20,
                backgroundColor: COLORS.background,
                padding: 8,
              }}
              onPress={acessarGaleria}>
              <Ionicons
                name="image-outline"
                size={20}
                color={COLORS.dominant}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{padding: 20}}>
        <View style={{marginBottom: 10}}>
          <Text style={styles.label}>Nome</Text>
          <View style={styles.input}>
            <Ionicons name="person-outline" size={18} />
            <TextInput
              style={styles.inputInner}
              value={name === null ? userInfo.nome : name}
              onChangeText={data => {
                setName(data);
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.input}>
            <Ionicons name="at-outline" size={18} />
            <TextInput
              style={styles.inputInner}
              value={email === null ? userInfo.email : email}
              onChangeText={data => {
                setEmail(data);
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.input}>
            <Ionicons name="key-outline" size={18} />
            <TextInput
              style={styles.inputInner}
              value={password === null ? userInfo.senha : password}
              secureTextEntry={showPassword}
              onChangeText={data => {
                setPassword(data);
              }}
            />
            <TouchableOpacity onPress={togglePassword}>
              <Ionicons name={passwordIcon} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.label}>Gênero</Text>
          <View>
            <DropDownPicker
              style={styles.input}
              open={open1}
              value={gender !== null ? gender : userInfo.sexo}
              items={genero}
              setOpen={toggleOpenGender}
              setValue={setGender}
              setItems={setGenero}
              closeOnBackPressed={true}
              closeOnPressOut={true}
              dropDownContainerStyle={{
                padding: 4,
                marginTop: 10,
                fontWeight: 'bold',
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.label}>Telefone</Text>
          <View style={styles.input}>
          <Ionicons name="call-outline" size={18} />
            <TextInput
              keyboardType="Numeric"
              style={styles.inputInner}
              value={phone === null ? userInfo.telefone : phone}
              onChangeText={data => {
                setPhone(data);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.dominant,
            padding: 10,
            paddingVertical: 14,
            borderRadius: 30,
            width: 220,
            flexDirection: 'row',
            gap: 6,
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{color: COLORS.background, fontSize: SIZES.h5}}>
            Guardar Alterações
          </Text>
          <AntDesign name="checkcircle" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* {modal == false ? (
        <></>
      ) : (
        <View
          style={{
            position: 'absolute',
            width: SIZES.width,
            height: SIZES.height,
            top: 0,
            left: 0,
            backgroundColor: COLORS.darkOpacity,
            zIndex: 9,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',
              height: 250,
              backgroundColor: COLORS.background,
              borderRadius: 10,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                right: 0,
                top: 0,
                padding: 10,
                position: 'absolute',
              }}
              onPress={closeModal}>
              <Ionicons name="close" color="red" size={24} />
            </TouchableOpacity>
            <Ionicons name="image-outline" size={100} color={COLORS.dominant} />
            <Text>Escolha uma foto</Text>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.dominant,
                padding: 10,
                borderRadius: 20,
                marginTop: 10,
              }}
              onPress={acessarGaleria}>
              <Text style={{color: COLORS.background}}>Acessar Galéria</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  header: {
    backgroundColor: 'none',
    width: '100%',
    // position: 'absolute',
    top: 0,
    left: 0,
    height: 60,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
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
    marginTop: -20,
  },
  userIcon: {
    elevation: 10,
    shadowColor: COLORS.dark,
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 10,
    },
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: COLORS.garkRgba,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 4,
    shadowOffset: {
      width: 40,
      height: 40,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowColor: COLORS.dark,
    elevation: 40,
  },
  editButton: {
    position: 'absolute',
    backgroundColor: COLORS.background,
    padding: 4,
    borderRadius: 20,
    right: 0,
    top: 0,
  },
  input: {
    padding: 8,
    height: 50,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#eee',
    paddingLeft: 10,
    borderRadius: 25,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    borderWidth: 0,
    // justifyContent: "space-between"
  },
  inputInner: {
    width: '85%',
  },
  label: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.dark,
    opacity: 0.4,
  },
});

export default Editar;
