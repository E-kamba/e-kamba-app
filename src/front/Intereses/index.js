import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  Alert,
} from 'react-native';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {COLORS, SIZES} from '../Theme';
import {useAuth} from '../Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const Preferences = ({navigation}) => {
  const {preferences, setPreferences, categorias, userInfo} = useAuth();
  const [selectedPreferences, setSelectedPreferences] = useState(
    preferences.length > 0 ? preferences[0].Interesses : [],
  );

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

  const togglePreference = id => {
    setSelectedPreferences(prevData =>
      prevData.includes(id)
        ? prevData.filter(itemId => itemId !== id)
        : [...prevData, id],
    );
  };

  const savePreferences = async () => {
    const {id} = userInfo;
    const preferencesData = {idUsuario: id, Interesses: selectedPreferences};
    await AsyncStorage.setItem('preferences', JSON.stringify(preferencesData));

    const data = await AsyncStorage.getItem('preferences');
    if (data.length > 0) {
      setPreferences(data)
      // console.log(data)
      navigation.navigate('Home');
    } else {
      Alert.alert('As tuas preferências não foram salvas!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" size={28} color={COLORS.dominant} />
        </TouchableOpacity>
        <Ionicons name="filter-outline" size={28} color={COLORS.dominant} />
        <Text style={styles.headerTitle}>Preferências</Text>
      </View>
      <Text style={styles.description}>
        Claro! Nos conte sobre suas preferências e expectativas em relação à
        e-kamba para que possamos oferecer uma experiência excepcional.
      </Text>
      <ScrollView scrollEnabled={true} style={styles.preferencesContainer}>
        {categorias.slice(1, 13).map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => togglePreference(item.id)}
            style={[
              styles.preferenceItem,
              {
                backgroundColor: selectedPreferences.includes(item.id)
                  ? COLORS.dominant
                  : 'transparent',
                borderColor: COLORS.dominant,
              },
            ]}>
            <Ionicons
              name={item.icon}
              size={24}
              color={
                selectedPreferences.includes(item.id)
                  ? COLORS.background
                  : COLORS.dark
              }
            />
            <Text
              style={{
                color: selectedPreferences.includes(item.id)
                  ? COLORS.background
                  : COLORS.dark,
              }}>
              {item.categoria}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={savePreferences} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Concluir</Text>
        <AntDesign name="check" size={26} color={COLORS.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  headerTitle: {
    fontSize: SIZES.h5,
    marginLeft: 10,
    color: COLORS.dominant,
  },
  description: {
    fontSize: SIZES.h4,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    margin: 5,
  },
  saveButton: {
    backgroundColor: COLORS.dominant,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    position: 'absolute',
    bottom: 50,
  },
  saveButtonText: {
    fontSize: SIZES.h4,
    color: COLORS.background,
  },
});

export default Preferences;
