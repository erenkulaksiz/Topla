import React from 'react';
import { View, Image } from "react-native";
import style from './style';

class Header extends React.Component {
    render() {
        return (
            <View style={style.container}>
                <Image
                    style={style.logo}
                    source={require('../../logo_full.png')}
                />
            </View>
        );
    }
}

export default Header