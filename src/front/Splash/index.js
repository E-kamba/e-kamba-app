import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert, Text } from "react-native";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        const networkState = await NetInfo.fetch();
        if (networkState.isConnected) {
          setTimeout(() => {
            navigation.navigate("Home");
          }, 3000);
        } else {
          Alert.alert(
            "Erro de conexão de rede. Verifique sua conexão à internet."
          );
        }
      } catch (error) {
        console.error("Erro ao verificar a conexão de rede:", error);
        throw error;
      }
    };
    checkNetworkConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.image}
        resizeMode="contain"
      />
      {/* Exibe um indicador de carregamento se isLoading for true */}
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <Image
            source={require("../../../assets/animation_lmylyrvl_small.gif")}
            style={styles.loadingImage}
            resizeMode="contain"
          />
          <Text style={styles.loadingText}>Aguarde...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 200,
  },
  loadingIndicator: {
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 40,
    height: 40,
  },
  loadingText: {
    opacity: 0.5,
    marginTop: 10,
  },
});

export default SplashScreen;
