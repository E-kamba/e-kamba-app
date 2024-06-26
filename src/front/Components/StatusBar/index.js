import React from "react";
import { StatusBar } from "react-native";
import { COLORS } from "../../Theme";

const StatusBarComponent = () => {
  return (
    <StatusBar
      style="auto"
      backgroundColor="#f5f5f5"
      barStyle="dark-content"
      animated={true}
    />
  );
};

export default StatusBarComponent;
