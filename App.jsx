import React, {useEffect} from 'react';
import {StyleSheet, Text, View, AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AntDesign, Ionicons, MaterialIcons, Feather} from '@expo/vector-icons';

// screens
import SplashScreen from './src/front/Splash';
import IntroSlider from './src/front/Slides';
import LoginScreen from './src/front/Login';
import HomeScreen from './src/front/Home';
import Perfil from './src/front/Perfil';
import Carrinho from './src/front/Carrinho';
import ProdutoScreen from './src/front/Pagina-de-produto';
import Explorar from './src/front/Explorar';
import Notificacoes from './src/front/Notificacoes';
import Search from './src/front/Search';
import Mensagem from './src/front/Mensagem';
import Categorias from './src/front/Categorias';
import {AuthProvider} from './src/front/Auth';
import StatusBarComponent from './src/front/Components/StatusBar';
import Privacy from './src/front/Perfil/Privacy-policy';
import About from './src/front/Perfil/About';
import Ajuda from './src/front/Perfil/Ajuda';
import Editar from './src/front/Perfil/Edit';

import {COLORS, SIZES} from './src/front/Theme';
import Preferences from './src/front/Intereses';
import Checkout from './src/front/Checkout';
import CheckoutDetails from './src/front/Checkout1';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Função para renderizar a navegação por tabs
const screenOptions = ({route}) => ({
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 60,
    display:
      route.name === 'Explorar'
        ? 'none'
        : 'flex' && route.name === 'Carrinho'
        ? 'none'
        : 'flex',
  },
  tabBarIcon: ({focused}) => {
    let iconName;
    let IconComponent = AntDesign;

    if (route.name === 'Home') {
      iconName = focused ? 'home' : 'home';
    } else if (route.name === 'Perfil') {
      iconName = focused ? 'user' : 'user';
    } else if (route.name === 'Explorar') {
      iconName = focused ? 'compass' : 'compass';
    } else if (route.name === 'Carrinho') {
      iconName = focused ? 'shopping-cart' : 'shopping-cart';
    }

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? COLORS.dominant : COLORS.dark,
          width: 50,
          height: 50,
          justifyContent: 'center',
          borderRadius: 100,
          alignContent: 'center',
          marginBottom: focused ? 20 : 5,
        }}>
        <Feather
          name={iconName}
          size={28}
          color={focused ? COLORS.background : COLORS.dominant}
        />
      </View>
    );
  },
});

function TabsNavigation() {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: COLORS.dark,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 50,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Explorar"
        component={Explorar}
        options={() => ({
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Carrinho"
        component={Carrinho}
        options={() => ({
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
}

function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="IntroSlider" component={IntroSlider} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Home" component={TabsNavigation} />
        <Stack.Screen name="Perfil" component={TabsNavigation} />
        <Stack.Screen name="Categoria" component={Categorias} />
        <Stack.Screen
          name="Carrinho"
          component={TabsNavigation}
          options={{title: 'Carrinho'}}
        />
        <Stack.Screen
          name="Mensagem"
          component={TabsNavigation}
          options={{title: 'Mensagem'}}
        />
        <Stack.Screen
          name="Produto"
          component={ProdutoScreen}
          options={{title: 'Produto'}}
        />
        <Stack.Screen
          name="Sobre"
          component={About}
          options={{title: 'Sobre'}}
        />
        <Stack.Screen
          name="Politica"
          component={Privacy}
          options={{title: 'Politica de Privacidade'}}
        />
        <Stack.Screen
          name="Ajuda"
          component={Ajuda}
          options={{title: 'Ajuda'}}
        />
        <Stack.Screen
          name="Preferences"
          component={Preferences}
          options={{title: 'Ajuda'}}
        />
        <Stack.Screen
          name="Editar"
          component={Editar}
          options={{title: 'Editar Perfil'}}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{title: 'Pagamentos'}}
        />
        <Stack.Screen
          name="CheckoutDetails"
          component={CheckoutDetails}
          options={{title: 'Detalhes da compra'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBarComponent />
      <AppRoutes />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    left: 25,
    backgroundColor: COLORS.dominant,
    color: COLORS.background,
    fontSize: SIZES.span,
    fontWeight: '600',
    padding: 2,
    borderRadius: 20,
    width: 20,
    height: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
