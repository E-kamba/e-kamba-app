import {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {MaterialIcons, AntDesign} from '@expo/vector-icons';
import {SIZES, COLORS} from '../../Theme';

const Modal = ({
  event,
  modalIcon,
  modalText,
  modalTitle,
  modalBtn = false,
  btnClose,
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: SIZES.width,
        height: SIZES.height,
        backgroundColor: COLORS.darkOpacity,
        justifyContent: 'flex-end',
        zIndex: 9,
      }}>
      <Pressable
        style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          alignContent: 'flex-end',
        }}>
        <TouchableOpacity onPress={btnClose}>
          <AntDesign
            name="close"
            style={{marginRight: 20, marginBottom: 10}}
            color={COLORS.background}
            size={24}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: COLORS.background,
            width: SIZES.width,
            height: SIZES.height / 2.7,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: 60,
            paddingHorizontal: 10,
            paddingVertical: 30,
          }}>
          <MaterialIcons name={modalIcon} size={50} color={COLORS.dominant} />
          <Text
            style={{
              color: COLORS.primary,
              fontSize: SIZES.h5,
              fontWeight: 'bold',
            }}>
            {modalTitle}
          </Text>
          <Text
            style={{
              width: '80%',
              fontSize: SIZES.h6,
              textAlign: 'center',
              opacity: 0.5,
              marginBottom: 10,
            }}>
            {modalText}
          </Text>
          {modalBtn !== false ? (
            <TouchableOpacity
              style={{
                marginBottom: 60,
                backgroundColor: COLORS.dominant,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
              }}
              onPress={event}
              //   style={btnPrimary}
            >
              <Text style={{color: COLORS.background, fontSize: SIZES.h5}}>
                Criar conta
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default Modal;
