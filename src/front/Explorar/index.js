import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import {COLORS, SIZES} from '../Theme';
import {WebView} from 'react-native-webview';
import {AntDesign} from '@expo/vector-icons';
import {useRoute} from '@react-navigation/native';
import {Dimensions} from 'react-native';

export default function Explorar({navigation, produto}) {
  const [quantities, setQuantities] = useState({});
  const screenWidth = Dimensions.get('window').width;
  const [activeIndex, setActiveIndex] = useState(0);

  const getItemLayou = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  const handleScroll = event => {
    const scrollPosition = SIZES.height;
    const index = scrollPosition.toFixed(0);
    setActiveIndex(index);
  };

  const reels = [
    {
      id: 1,
      contentType: 'video',
      title: 'Video 1',
      text: 'Lorem ipsum dolor',
      source: 'https://appdist.qml.ao/uploads/vid-1.mp4',
    },
    {
      id: 2,
      contentType: 'video',
      title: 'Video 2',
      text: 'Lorem ipsum dolor',
      source: 'https://appdist.qml.ao/uploads/vid-2.mp4',
    },
    {
      id: 3,
      contentType: 'video',
      title: 'Video 3',
      text: 'Lorem ipsum dolor',
      source: 'https://appdist.qml.ao/uploads/vid-3.mp4',
    },
  ];

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" size={24} color={COLORS.background} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Novidades</Text>
      </View>
      <FlatList
        pagingEnabled={true}
        // onScroll={handleScroll}
        // getItemLayout={getItemLayou}
        vertical={true}
        style={styles.videos}
        data={reels}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.videoContainer}>
            <WebView
              source={{uri: item.source}}
              style={styles.webview}
              allowsInlineMediaPlayback={true}
            />
            <View style={{position: 'absolute', top: 45, left: 35}}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoText}>{item.text}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    width: '100%',
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 0,
    backgroundColor: COLORS.darkOpacity,
    zIndex: 9,
    position: 'absolute',
  },
  headerText: {
    color: COLORS.background,
    marginLeft: 10,
    fontSize: 18,
  },
  videos: {
    width: SIZES.width,
    height: SIZES.height,
  },
  videoContainer: {
    marginBottom: 20,
    height: SIZES.height,
    // position: 'absolute',
  },
  webview: {
    width: SIZES.width,
    height: SIZES.height,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  videoText: {
    color: '#ccc',
    fontSize: 14,
    paddingHorizontal: 10,
  },
});
