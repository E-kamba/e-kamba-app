import { Dimensions } from "react-native";
const { width, height } = Dimensions.get('screen');

export const COLORS = {
    background: '#fff',
    primary: '#000',
    alerta: 'red',
    title: '#f86818',
    preco: '#4caf59',
    vibrant: '#f86818',
    vibarantLight: '#f06830',
    dominant: '#f06830',
    dark: '#101010',
    garkRgba: '#000000c5',
    darkOpacity: '#00000051', 
    shadow: '#aeadad'

};

export const SIZES = {
    h1: 26,
    h2: 22,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    p: 12,
    span: 10,
    width,
    height
}