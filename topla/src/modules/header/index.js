import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faPause } from '@fortawesome/free-solid-svg-icons'

const Header = props => {
    return (
        <View style={style.container}>
            <View style={style.left}>
                {props.backShown && <View style={style.backWrapper}>
                    <TouchableOpacity style={style.back} onPress={() => { props.onBack() }}>
                        <FontAwesomeIcon icon={faArrowLeft} size={18} color={'black'} />
                    </TouchableOpacity>
                </View>}
            </View>
            <View style={style.middle}>
                <View style={style.logoWrapper}>
                    <Image
                        style={style.logo}
                        source={require('../../logo_full.png')}
                        resizeMode={'contain'}
                        fadeDuration={0}
                    />
                </View>
            </View>
            <View style={style.right}>
                {props.pauseShown && <View style={style.pauseWrapper}>
                    <TouchableOpacity style={style.pause} onPress={() => { props.onPause() }}>
                        <FontAwesomeIcon icon={faPause} size={14} color={'black'} />
                    </TouchableOpacity>
                </View>}
            </View>
        </View>
    );
}

export default Header;