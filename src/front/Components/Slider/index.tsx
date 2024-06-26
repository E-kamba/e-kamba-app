import React, { useEffect, useRef, useState } from "react";
// import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import { COLORS, SIZES } from "../../Theme";
import { Entypo } from "@expo/vector-icons";
import { Banner } from "../Banners";
import { styles } from "../Banners/style";
import { Dimensions } from "react-native";

const SlideComponent = () => {
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatlistRef = useRef();

  const carouselData = [
    {
      id: 1,
      title: "SEJA BEM-VINDO!",
      text: "Explore uma app intuitiva e cheia de novidades que vão melhorar a sua experiência com compras online.",
      productImage: null,
      bgImage: require("../../../../assets/banner-2.jpg"),
      btnTitle: null,
      btnFunction: null,
      bgColor: null,
      orientation: "row",
      textColor: "#f1f1f1",
      titleColor: "#fff",
      btnColor: null,
      btnTextColor: null,
      btnIcon: null,
    },
    {
      id: 2,
      title: "Ténis da Nike",
      text: "Ténis de Marca Nike, Modelo T90 em promoção!",
      productImage: require("../../../../assets/tenis-1.png"),
      bgImage: require("../../../../assets/banner-1.jpg"),
      btnTitle: "Comprar",
      btnFunction: null,
      bgColor: null,
      orientation: "row-reverse",
      titleColor: "purple",
      textColor: "#00a7",
      btnColor: "purple",
      btnTextColor: "#fff",
      btnIcon: "bag-handle-outline",
    },
    {
      id: 3,
      title: "Vestidos de Gala",
      text: "Vestidos elegantes em promoção!",
      productImage: require("../../../../assets/vestido.png"),
      bgImage: require("../../../../assets/banner-1.jpg"),
      btnTitle: "Comprar",
      btnFunction: null,
      bgColor: null,
      orientation: "row",
      titleColor: "red",
      textColor: "#000",
      btnColor: "red",
      btnTextColor: "#fff",
      btnIcon: "bag-handle-outline",
    },
  ];

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (activeIndex == carouselData.length - 1) {
  //       flatlistRef.current.scrollToIndex({
  //         index: 0,
  //         animation: true,
  //       });
  //     } else {
  //       flatlistRef.current.scrollToIndex({
  //         index: activeIndex + 1,
  //         animation: true,
  //       });
  //     }
  //   }, 2000);

  //   return clearInterval(intervalId)
  // }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.container}>
        <Banner
          title={item.title}
          text={item.text}
          productImage={item.productImage}
          btnTitle={item.btnTitle}
          bgImage={item.bgImage}
          btnFunction={item.btnFunction}
          bgColor={item.bgColor}
          orientation={item.orientation}
          textColor={item.textColor}
          titleColor={item.titleColor}
          btnColor={item.btnColor}
          btnTextColor={item.btnTextColor}
          btnIcon={item.btnIcon}
        />
      </View>
    );
  };

  const getItemLayou = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  const renderDots = () => {
    return carouselData.map((dot, index) => {
      if (activeIndex == index) {
        return (
          <TouchableOpacity
            // key={index}
            style={{
              marginHorizontal: 5, // Adiciona espaço horizontal entre os pontos
              width: 8,
              height: 8,
              borderRadius: 4, // Metade da altura para formar um círculo
              backgroundColor: COLORS.dominant,
              opacity: 1, // Define a opacidade dependendo do estado activeIndex
            }}
          ></TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            key={index}
            style={{
              marginHorizontal: 5, // Adiciona espaço horizontal entre os pontos
              width: 8,
              height: 8,
              borderRadius: 4, // Metade da altura para formar um círculo
              backgroundColor: COLORS.dominant,
              opacity: 0.4, // Define a opacidade dependendo do estado activeIndex
            }}
          ></TouchableOpacity>
        );
      }
    });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = (scrollPosition / screenWidth).toFixed(0);
    setActiveIndex(index);
  };

  return (
    <>
      <FlatList
        style={{ width: screenWidth, flexDirection: "row" }}
        ref={flatlistRef}
        getItemLayout={getItemLayou}
        horizontal={true}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        // scrollEnabled={false}
      />
      <View
        style={{
          flexDirection: "row",
          width: SIZES.width,
          justifyContent: "center",
        }}
      >
        {renderDots()}
      </View>
    </>
  );
};

export default SlideComponent;
