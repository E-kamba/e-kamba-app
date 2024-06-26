import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
} from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const gerarMensagem = () => {
    const saudacoes = ["Olá", "Oi", "Oi, tudo bem?", "E aí", "Oi, como vai?"];
    const atividades = [
      "você está programando",
      "está tendo um bom dia",
      "como foi seu fim de semana",
      "você está se sentindo hoje",
    ];
    const despedidas = ["Até logo", "Tchau", "Até mais", "Nos vemos depois"];

    const saudacao = saudacoes[Math.floor(Math.random() * saudacoes.length)];
    const atividade = atividades[Math.floor(Math.random() * atividades.length)];
    const despedida = despedidas[Math.floor(Math.random() * despedidas.length)];

    return `${saudacao}, ${atividade}. ${despedida}!`;
  };

  const onSend = (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setTimeout(() => {
      const respostaAutomatica = {
        _id: Math.round(Math.random() * 1000000),
        text: gerarMensagem(),
        createdAt: new Date(),
        user: {
          _id: 0,
          name: "Bot",
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [respostaAutomatica])
      );
    }, 1000);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      />
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            type="font-awesome"
            name="send"
            style={{ marginBottom: 10, marginRight: 10 }}
            size={25}
            color="#1bbff1"
            tvParallaxProperties={undefined}
            renderInputToolbar={renderInputToolbar}
          />
        </View>
      </Send>
    );
  };

  useEffect(() => {
    const welcomeMessage = {
      _id: 0,
      text: "Bem-vindo ao chat!",
      createdAt: new Date(),
      user: {
        _id: 0,
        name: "Bot",
      },
      system: true,
    };

    setMessages([welcomeMessage]);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: 1,
      }}
      textInputProps={{
        style: {
          backgroundColor: "white",
          paddingHorizontal: 10,
          fontSize: 18,
          height: 40,
          width: "90%",
        },
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
    />
  );
};

export default ChatScreen;
