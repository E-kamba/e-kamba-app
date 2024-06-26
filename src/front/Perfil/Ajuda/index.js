import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {COLORS, SIZES} from '../../Theme';

const Ajuda = ({navigation}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const helpItems = [
    {
      id: 1,
      question: 'Como faço para criar uma conta?',
      answer:
        'Para criar uma conta, clique no botão "Registrar" na tela inicial. Preencha o formulário com seus dados pessoais e clique em "Enviar". Você receberá um e-mail de confirmação para ativar sua conta.',
    },
    {
      id: 2,
      question: 'Esqueci minha senha. O que devo fazer?',
      answer:
        'Clique em "Esqueci minha senha" na tela de login. Digite seu e-mail registrado e você receberá um link para redefinir sua senha.',
    },
    {
      id: 3,
      question: 'Como rastrear meu pedido?',
      answer:
        'Para rastrear seu pedido, vá até a seção "Meus Pedidos" no menu do perfil. Selecione o pedido que deseja rastrear e clique em "Rastrear Pedido".',
    },
    {
      id: 4,
      question: 'Como posso alterar meu endereço de entrega?',
      answer:
        'Para alterar seu endereço de entrega, vá até a seção "Configurações" no menu do perfil e selecione "Endereços". Edite ou adicione um novo endereço e salve as alterações.',
    },
    {
      id: 5,
      question: 'Posso cancelar ou alterar meu pedido?',
      answer:
        'Sim, você pode cancelar ou alterar seu pedido antes que ele seja despachado. Vá até "Meus Pedidos", selecione o pedido que deseja cancelar ou alterar e siga as instruções.',
    },
    {
      id: 6,
      question: 'Como faço para adicionar produtos à minha lista de desejos?',
      answer:
        'Para adicionar produtos à sua lista de desejos, clique no ícone de coração ao lado do produto. Você pode acessar sua lista de desejos a partir do menu do perfil.',
    },
    {
      id: 7,
      question: 'Como entro em contato com o suporte ao cliente?',
      answer:
        'Para entrar em contato com o suporte ao cliente, vá até a seção "Ajuda" e selecione "Contato". Você pode enviar uma mensagem ou ligar para nosso suporte.',
    },
    {
      id: 8,
      question: 'Como aplico um cupom de desconto?',
      answer:
        'Para aplicar um cupom de desconto, vá até o carrinho de compras e insira o código do cupom no campo "Cupom de Desconto". Clique em "Aplicar" para atualizar o total do pedido.',
    },
    {
      id: 9,
      question: 'Quais métodos de pagamento são aceitos?',
      answer:
        'Aceitamos diversos métodos de pagamento, incluindo cartões de crédito, débito, PayPal e pagamento na entrega. Selecione seu método preferido durante o checkout.',
    },
    {
      id: 10,
      question: 'O que devo fazer se receber um produto defeituoso?',
      answer:
        'Se você receber um produto defeituoso, entre em contato com nosso suporte ao cliente imediatamente. Vá até a seção "Ajuda" e selecione "Contato".',
    },
  ];

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

  const selectItem = id => {
    setSelectedItem(prevSelectedItem => (prevSelectedItem === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick}>
          <AntDesign name="arrowleft" color={COLORS.dominant} size={28} />
        </TouchableOpacity>
        <Ionicons name="help-circle-outline" size={28} color={COLORS.dominant} />
        <Text
          style={{
            fontSize: SIZES.h5,
            fontWeight: 'bold',
            color: COLORS.dominant,
            marginLeft: -10,
          }}>
          Ajuda
        </Text>
      </View>

      <FlatList
        data={helpItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.helpItem}>
            <TouchableOpacity
              onPress={() => selectItem(item.id)}
              style={styles.question}>
              <Text style={{color: COLORS.dominant, fontWeight: 'bold'}}>
                {item.question}
              </Text>
              <AntDesign
                name={item.id === selectedItem ? 'down' : 'right'}
                size={20}
                color={COLORS.dominant}
              />
            </TouchableOpacity>
            <View
              style={{
                paddingVertical: 8,
                display: item.id === selectedItem ? 'flex' : 'none',
                borderTopColor: '#ccc',
                borderTopWidth: 1,
              }}>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'none',
    padding: 16,
  },
  helpItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  question: {
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answer: {
    fontSize: SIZES.h6,
    color: '#555',
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
});

export default Ajuda;
