import {React, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {SIZES} from '../../Theme';

const About = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const handleBackButtonClick = () => {
    navigation.goBack();
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" color={COLORS.dominant} size={28} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: SIZES.h5,
            fontWeight: 'bold',
            color: COLORS.dominant,
          }}>
          Ajuda
        </Text>
      </View>
      <WebView
        source={{uri: 'https://appdist.qml.ao/about'}}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'none',
    width: '100%',
    // position: 'absolute',
    top: 0,
    left: 0,
    height: 60,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 9,
    paddingHorizontal: 10,
  },
  webview: {
    flex: 1,
  },
});

export default About;
