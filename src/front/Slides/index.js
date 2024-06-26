import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { COLORS, SIZES } from "../Theme";

const Logo = [
  {
    uri: require("../../../assets/icon.png"),
  },
];

const slides = [
  {
    id: 1,
    title: "Adiversidade!",
    description:
      "O Vula oferece um amplo catálogo de produtos, incluindo eletrônicos, moda, casa, beleza e muito mais. Encontre tudo o que procura e explore uma variedade infinita de opções, de forma rápida e fácil.",
    image: require("../../../assets/slide-1.jpg"),
  },
  {
    id: 2,
    title: "Navegação intuitiva",
    description:
      "Não perca mais tempo procurando em diferentes lojas online. Descubra como é fácil e conveniente encontrar tudo o que você precisa em um único lugar.",
    image: require("../../../assets/slide-2.jpg"),
  },
  {
    id: 3,
    title: "Experiência sem complicações",
    description:
      "Abra as portas para o futuro das compras e aproveite uma experiência única de e-commerce. O Vula está aqui para tornar sua vida mais fácil e suas compras mais prazerosas.",
    image: require("../../../assets/slide-3.png"),
  },
];

const buttonLabel = (label) => {
  return (
    <View
      style={{
        padding: 12,
        backgroundColor: COLORS.vibarantLight,
        borderRadius: 30,
      }}
    >
      <Pressable>
        <Text
          style={{
            fontSize: SIZES.h5,
            color: COLORS.background,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

export default function IntroSlider({ navigation }) {
  return (
    <AppIntroSlider
      style={{
        backgroundColor: COLORS.background,
        with: "100%",
      }}
      data={slides}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              // position: 'absolute',
              bottom: 100,
            }}
          >
            <Image
              source={item.image}
              alt={item.title}
              style={{
                width: SIZES.width,
                height: SIZES.height,
                padding: 20,
                justifyContent: "flex-end",
                alignItems: "center",
                alignSelf: "center",
                position: "relative",
                top: 0,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                alignContent: "center",
                alignItems: "center",
                padding: 25,
                position: "absolute",
                zIndex: 6,
                bottom: -100,
                width: SIZES.width,
                height: SIZES.height / 3,
                backgroundColor: COLORS.dark,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontSize: SIZES.h2,
                  color: COLORS.background,
                  fontWeight: "900",
                  marginTop: -65,
                  textAlign: "center",
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: SIZES.h4,
                  alignContent: "center",
                  alignSelf: "center",
                  textAlign: "center",
                  color: COLORS.background,
                  opacity: 0.7,
                  fontWeight: "100",
                  marginTop: 10,
                }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        );
      }}
      dotStyle={{
        height: 8,
        backgroundColor: "#ccc",
        width: 8,
      }}
      activeDotStyle={{
        backgroundColor: COLORS.title,
        width: 20,
        height: 8,
      }}
      showSkipButton
      renderNextButton={() => buttonLabel("Próximo")}
      renderSkipButton={() => buttonLabel("Pular")}
      renderDoneButton={() => buttonLabel("Finalizar")}
      onDone={() => navigation.navigate("Login")}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark,
  },
});
