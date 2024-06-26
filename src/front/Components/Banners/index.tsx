import React from "react";
import {
  Image,
  ImageProps,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES } from "../../Theme";
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
} from "@expo/vector-icons";

type Props = ImageProps;

export function Banner({
  bgImage,
  title,
  text,
  btnTitle,
  btnFunction,
  bgColor,
  orientation,
  productImage,
  textColor,
  titleColor,
  btnColor,
  btnTextColor,
  btnIcon,
}) {
  return (
    <View
      style={{
        borderRadius: 10,
        overflow: "hidden",
        width: "100%",
        height: 200,
        backgroundColor: bgColor == null ? COLORS.background : bgColor,
        padding: 10,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
          width: 40,
          height: 40,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowColor: COLORS.shadow,
        elevation: 40,
      }}
    >
      <Image
        source={bgImage}
        style={{
          width: SIZES.width,
          height: SIZES.height,
          position: "absolute",
          top: 0,
        }}
      />
      <View
        style={{
          flexDirection: orientation == null ? "row" : orientation,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          //   width: "100%",
          //   padding: 10,
        }}
      >
        <View
          style={{
            alignItems: productImage == null ? "center" : "left",
            width: productImage == null ? SIZES.width / 1.2 : SIZES.width / 2,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            marginLeft: productImage == null ? 0 : 20,
          }}
        >
          <Text
            style={{
              fontSize: SIZES.h3,
              fontWeight: "bold",
              color: titleColor == null ? COLORS.dark : titleColor,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: SIZES.h6,
              color: textColor == null ? COLORS.dark : textColor,
              textAlign: productImage == null ? "center" : "left",
            }}
          >
            {text}
          </Text>
          {btnTitle == null ? (
            <></>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: btnColor == null ? COLORS.dominant : btnColor,
                borderRadius: 20,
                width: 100,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginTop: 8,
                padding: 8,
                flexDirection: "row",
                gap: 4,
              }}
              onPress={btnFunction}
            >
              <Text style={{ color: btnColor == null ? "#fff" : btnTextColor }}>
                {btnTitle}
              </Text>
              <Ionicons name={btnIcon} size={18} color={btnTextColor} />
            </TouchableOpacity>
          )}
        </View>
        {productImage == null ? (
          <></>
        ) : (
          <Image
            source={productImage == null ? null : productImage}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}
