import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';

export default function Header({navigation}) {
    
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" size={28} />
        </TouchableOpacity>
        {/* <Text>Perfil</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'none',
    height: 100,
    width: '100%',
    paddingTop: 20,
  },
  header: {
    backgroundColor: 'none',
    width: '100%',
    position: 'absolute',
    top: -20,
    left: 0,
    height: 100,
    marginTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 9,
    paddingHorizontal: 10,
  },
});
