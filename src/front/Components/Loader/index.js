import React, { useEffect } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { COLORS, SIZES } from "../../Theme";

const Loader = ({ loadImage, loadText }) => {
  return (
    <View style={styles.container}>
      <Image source={loadImage} style={{ width: 80, height: 80 }} />
      <Text style={{ color: COLORS.background, marginTop: 10 }}>
        {loadText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: COLORS.darkOpacity,
    zIndex: 9,
    width: SIZES.width,
    height: SIZES.height,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});

export default Loader;
