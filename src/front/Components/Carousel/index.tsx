import React, { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SIZES } from "../../Theme";
import { Entypo } from "@expo/vector-icons";
import { Banner } from "../Banners";
import { styles } from "../Banners/style";
import { Dimensions } from "react-native";

const CarouselComponent = () => {
  const slideX = useSharedValue(0);
  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: slideX.value}]
  }))

  const width = Dimensions.get("window").width - 20;

  useEffect(() => {
    slideX.value = withRepeat(withTiming(-width, {
      duration: 5000,
      easing: Easing.linear,
    }), 1)
  },[])

  const data = [
    // Inclua aqui os dados dos seus slides
    { image: require("../../../../assets/img/banner.png") },
    { image: require("../../../../assets/img/banner-1.png") },
    { image: require("../../../../assets/img/banner-2.png") },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, slideAnimatedStyle]}>
      {
        data.map(item => {
          return(
            <Banner source={item.image}/>
            )
          })
        }
        </Animated.View>
    </View>
  );
};

export default CarouselComponent;
