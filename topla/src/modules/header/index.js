import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faPause } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types';

class Header extends React.Component {
    render() {

        const {
            backShown,
            pauseShown,
            onBack,
            onPause,
        } = this.props

        return (
            <View style={style.container}>
                <View style={style.left}>
                    {backShown && <View style={style.backWrapper}>
                        <TouchableOpacity style={style.back} onPress={() => { onBack() }}>
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
                    {pauseShown && <View style={style.pauseWrapper}>
                        <TouchableOpacity style={style.pause} onPress={() => { onPause() }}>
                            <FontAwesomeIcon icon={faPause} size={14} color={'black'} />
                        </TouchableOpacity>
                    </View>}
                </View>
            </View>
        );
    }
}

Header.propTypes = {
    backShown: PropTypes.bool,
    pauseShown: PropTypes.bool,
    onBack: PropTypes.func,
    onPause: PropTypes.func,
}

export default Header;