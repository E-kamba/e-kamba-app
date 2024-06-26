import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Feather } from "@expo/vector-icons";

import HomeScreen from "../../Home";
import Perfil from "../../Perfil";
import Carrinho from "../../Carrinho";
import Mensagem from "../../Mensagem";
import { COLORS } from "../../Theme";
import { View } from "react-native";
import ListaDeDesejos from "../../Explorar";
import Notificacoes from "../../Notificacoes";
import Explorar from "../../Explorar";

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 50,
  },
  tabBarIcon: ({ focused }) => {
    let iconName;
    let IconComponent = AntDesign;

    if (route.name === "Home") {
      iconName = focused ? "home" : "home";
    } else if (route.name === "Perfil") {
      iconName = focused ? "user" : "user";
    } else if (route.name === "Explorar") {
      iconName = focused ? "compass" : "compass";
    } else if (route.name === "Notificacoes") {
      iconName = focused ? "bell" : "bell";
    }

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? COLORS.dominant : COLORS.dark,
          width: 45,
          height: 45,
          justifyContent: "center",
          borderRadius: 100,
          alignContent: "center",
          marginBottom: focused ? 20 : 5,
        }}
      >
        <Feather
          name={iconName}
          size={28}
          color={focused ? COLORS.background : COLORS.dominant}
        />
      </View>
    );
  },
});

function BottomTab() {
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
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
        name="Notificacoes"
        component={Notificacoes}
        options={() => ({
          headerShown: true,
        })}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;
