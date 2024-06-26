import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { COLORS, SIZES } from "../Theme";

const Search = ({ navigation }) => {
  const [search, setSearch] = useState();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => backHandler.remove();
  }, []);

  const handleBackButtonClick = () => {
    navigation.goBack();
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 24,
          marginTop: 40,
          gap: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 40,
            borderColor: "#bcaaa4",
            borderWidth: 0.5,
            padding: 8,
            borderRadius: 30,
            gap: 12,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AntDesign name="search1" size={24} color="#bcaaa4" />
          <TextInput
            style={{
              flex: 1,
            }}
            placeholder="Procurar"
            onChangeValue={() => {
              setSearch();
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.title,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
          }}
        >
          <FontAwesome name="sliders" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
    height: SIZES.height,
  },
  header: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
});
