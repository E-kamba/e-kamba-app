import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
import {COLORS} from '../Theme';
import {db} from '../../back/database';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [local, setLocal] = useState("");
  const [locations, setLocations] = useState([]);

  const categorias = [
    {
      id: 1,
      categoria: 'Todos',
      icon: 'format-list-checkbox',
      image: require('../../../assets/cat/1.1.jpeg'),
    },
    {
      id: 2,
      categoria: 'Eletrônicos',
      icon: 'headset-outline',
      image: require('../../../assets/cat/2.jpeg'),
    },
    {
      id: 3,
      categoria: 'Vestuário e Moda',
      icon: 'shirt-outline',
      image: require('../../../assets/cat/3.jpeg'),
    },
    {
      id: 4,
      categoria: 'Moveis e Decoração',
      icon: 'bed-outline',
      image: require('../../../assets/cat/4.jpeg'),
    },
    {
      id: 5,
      categoria: 'Beleza e Cuidados',
      icon: 'sparkles-outline',
      image: require('../../../assets/cat/5.jpeg'),
    },
    {
      id: 6,
      categoria: 'Esportes e Lazer',
      icon: 'basketball-outline',
      image: require('../../../assets/cat/6.jpeg'),
    },
    {
      id: 7,
      categoria: 'Saúde e Bem-estar',
      icon: 'pulse',
      image: require('../../../assets/cat/7.jpeg'),
    },
    {
      id: 8,
      categoria: 'Livros e Mídia',
      icon: 'book-outline',
      image: require('../../../assets/cat/8.jpeg'),
    },
    {
      id: 9,
      categoria: 'Alimentos e Bebidas',
      icon: 'fast-food-outline',
      image: require('../../../assets/cat/9.jpeg'),
    },
    {
      id: 10,
      categoria: 'Automotivo',
      icon: 'car-outline',
      image: require('../../../assets/cat/10.jpeg'),
    },
    {
      id: 11,
      categoria: 'Brinquedos e Jogos',
      icon: 'game-controller-outline',
      image: require('../../../assets/cat/11.jpeg'),
    },
    {
      id: 12,
      categoria: 'Ferramentas e Construção',
      icon: 'construct-outline',
      image: require('../../../assets/cat/12.jpeg'),
    },
    {
      id: 13,
      categoria: 'Viagens e Acessórios',
      icon: 'watch-outline',
      image: require('../../../assets/cat/13.jpeg'),
    },
  ];

  const subcategorias = [
    {
      id: 1,
      subcategoria: 'Smartphones',
      categoria: 2,
    },
    {
      id: 2,
      subcategoria: 'Computadores',
      categoria: 2,
    },
    {
      id: 3,
      subcategoria: 'Tablets',
      categoria: 2,
    },
    {
      id: 4,
      subcategoria: 'Câmeras',
      categoria: 2,
    },
    {
      id: 5,
      subcategoria: 'TVs e Monitores',
      categoria: 2,
    },
    {
      id: 6,
      subcategoria: 'Auriculares e Alto-falantes',
      categoria: 2,
    },
    {
      id: 7,
      subcategoria: 'Acessórios de tecnologia',
      categoria: 2,
    },
    {
      id: 8,
      subcategoria: 'Homens',
      categoria: 3,
    },
    {
      id: 52,
      subcategoria: 'Mulheres',
      categoria: 3,
    },
    {
      id: 53,
      subcategoria: 'Crianças',
      categoria: 3,
    },
    {
      id: 9,
      subcategoria: 'Calçados',
      categoria: 3,
    },
    {
      id: 10,
      subcategoria: 'Bolsas',
      categoria: 3,
    },
    {
      id: 54,
      subcategoria: 'Óculos',
      categoria: 3,
    },
    {
      id: 55,
      subcategoria: 'Relógios',
      categoria: 3,
    },
    {
      id: 11,
      subcategoria: 'Joias e bijuterias',
      categoria: 3,
    },
    {
      id: 12,
      subcategoria: 'Sofás',
      categoria: 4,
    },
    {
      id: 56,
      subcategoria: 'Camas',
      categoria: 4,
    },
    {
      id: 57,
      subcategoria: 'Mesas',
      categoria: 4,
    },
    {
      id: 13,
      subcategoria: 'Decoração de interiores',
      categoria: 4,
    },
    {
      id: 14,
      subcategoria: 'Panelas',
      categoria: 4,
    },
    {
      id: 58,
      subcategoria: 'Talheres',
      categoria: 4,
    },
    {
      id: 15,
      subcategoria: 'Geladeiras',
      categoria: 4,
    },
    {
      id: 59,
      subcategoria: 'Máquinas',
      categoria: 4,
    },
    {
      id: 16,
      subcategoria: 'Maquiagem',
      categoria: 5,
    },
    {
      id: 17,
      subcategoria: 'Cuidados com a pele',
      categoria: 5,
    },
    {
      id: 18,
      subcategoria: 'Cabelo (shampoos, condicionadores, etc.)',
      categoria: 5,
    },
    {
      id: 19,
      subcategoria: 'Perfumes e fragrâncias',
      categoria: 5,
    },
    {
      id: 20,
      subcategoria: 'Produtos de higiene pessoal',
      categoria: 5,
    },
    {
      id: 21,
      subcategoria: 'Equipamentos esportivos',
      categoria: 6,
    },
    {
      id: 22,
      subcategoria: 'Roupas e calçados esportivos',
      categoria: 6,
    },
    {
      id: 23,
      subcategoria: 'Acessórios para atividades ao ar livre',
      categoria: 6,
    },
    {
      id: 24,
      subcategoria: 'Equipamentos de academia e fitness',
      categoria: 6,
    },
    {
      id: 25,
      subcategoria: 'Vitaminas e suplementos',
      categoria: 7,
    },
    {
      id: 26,
      subcategoria: 'Equipamentos médicos',
      categoria: 7,
    },
    {
      id: 27,
      subcategoria: 'Primeiros socorros',
      categoria: 7,
    },
    {
      id: 28,
      subcategoria: 'Produtos de apoio à saúde',
      categoria: 7,
    },
    {
      id: 29,
      subcategoria: 'Livros impressos e e-books',
      categoria: 8,
    },
    {
      id: 30,
      subcategoria: 'Filmes e séries de TV',
      categoria: 8,
    },
    {
      id: 31,
      subcategoria: 'Música (CDs, vinis, downloads digitais)',
      categoria: 8,
    },
    {
      id: 32,
      subcategoria: 'Jogos de vídeo game',
      categoria: 8,
    },
    {
      id: 33,
      subcategoria: 'Alimentos enlatados e embalados',
      categoria: 9,
    },
    {
      id: 34,
      subcategoria: 'Bebidas (refrigerantes, sucos, vinhos, cervejas, etc.)',
      categoria: 9,
    },
    {
      id: 35,
      subcategoria: 'Produtos gourmet e especialidades regionais',
      categoria: 9,
    },
    {
      id: 36,
      subcategoria: 'Chocolates e doces',
      categoria: 9,
    },
    {
      id: 37,
      subcategoria: 'Peças de automóveis',
      categoria: 10,
    },
    {
      id: 38,
      subcategoria: 'Acessórios automotivos (pneus, tapetes, etc.)',
      categoria: 10,
    },
    {
      id: 39,
      subcategoria: 'Produtos de manutenção de veículos',
      categoria: 10,
    },
    {
      id: 40,
      subcategoria: 'Eletrônicos automotivos (GPS, rádios, etc.)',
      categoria: 10,
    },
    {
      id: 41,
      subcategoria: 'Brinquedos para crianças',
      categoria: 11,
    },
    {
      id: 42,
      subcategoria: 'Jogos de tabuleiro',
      categoria: 11,
    },
    {
      id: 43,
      subcategoria: 'Quebra-cabeças',
      categoria: 11,
    },
    {
      id: 44,
      subcategoria: 'Jogos eletrônicos',
      categoria: 11,
    },
    {
      id: 45,
      subcategoria: 'Ferramentas manuais',
      categoria: 12,
    },
    {
      id: 46,
      subcategoria: 'Materiais de construção',
      categoria: 12,
    },
    {
      id: 47,
      subcategoria: 'Equipamentos de segurança',
      categoria: 12,
    },
    {
      id: 48,
      subcategoria: 'Produtos de jardinagem',
      categoria: 12,
    },
    {
      id: 49,
      subcategoria: 'Malas e bolsas de viagem',
      categoria: 13,
    },
    {
      id: 50,
      subcategoria: 'Acessórios de viagem (travesseiros de pescoço, etc.)',
      categoria: 13,
    },
    {
      id: 51,
      subcategoria: 'Equipamentos para camping e atividades ao ar livre',
      categoria: 13,
    },
  ];

  async function getProdutos() {
    try {
      const response = await axios.get('https://appdist.qml.ao/produtos');

      if (response.status === 200) {
        const products = response.data;
        await AsyncStorage.setItem('produtos', JSON.stringify(products));
        selectProducts();
      } else {
        throw new Error(
          `Erro ao obter dados da API. Status da resposta: ${response.status}`,
        );
      }
    } catch (error) {
      console.error('Erro ao obter dados da API:', error.message);
      // Lidar com o erro de forma apropriada, como exibir uma mensagem de erro para o usuário
    }
  }

  const selectProducts = async () => {
    let data = await AsyncStorage.getItem('produtos');

    if (data) {
      let productsAll = JSON.parse(data);
      setProdutos(productsAll);
    } else {
      console.log('Nenhum produto encontrado!');
    }
  };

  const getCartItems = async () => {
    try {
      const {id} = userInfo;
      const response = await axios.post(
        `https://appdist.qml.ao/carrinho/${id}`,
      );
      if (response.status === 200) {
        const products = response.data;
        await AsyncStorage.setItem('carrinho', JSON.stringify(products));
        getTotalCartData();
      } else {
        throw new Error(
          `Erro ao obter dados da API. Status da resposta: ${response.status}`,
        );
      }
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
    }
  };

  const getTotalCartData = async () => {
    const cartItems = await AsyncStorage.getItem('carrinho');
    const items = JSON.parse(cartItems);
    setCartData(items);
  };

  const getPreferences = async () => {
    const data = await AsyncStorage.getItem('preferences');
    if (data) {
      let prevData = JSON.parse(data);
      setPreferences(prevData);
    } else {
      Alert.alert('As tuas preferências não foram salvas!');
    }
  };

  useEffect(() => {
    getProdutos();
    getCartItems();
    getPreferences();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        latitude,
        longitude,
        getProdutos,
        userInfo,
        setUserInfo,
        produtos,
        setProdutos,
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
        setPreferences,
        subcategorias,
        getPreferences,
        region,
        setRegion,
        notifications,
        setNotifications,
        setLatitude,
        setLongitude,
        local,
        setLocal,
        locations,
        setLocations,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
