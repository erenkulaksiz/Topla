import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faPause } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import style from './style';
import Theme from '../../themes'

const Header = props => {
    return (
        <View style={{ ...style.container, backgroundColor: Theme(props.settings.darkMode).headerBackground }}>
            <View style={style.left}>
                {props.backShown && <View style={style.backWrapper}>
                    <TouchableOpacity style={{ ...style.back, backgroundColor: Theme(props.settings.darkMode).headerButtonsBackground }} onPress={() => { props.onBack() }}>
                        <FontAwesomeIcon icon={faArrowLeft} size={18} color={Theme(props.settings.darkMode).headerButtonsColor} />
                    </TouchableOpacity>
                </View>}
            </View>
            <View style={style.middle}>
                <View style={style.logoWrapper}>
                    {
                        props.settings.darkMode == "dark" ? <Image
                            style={style.logo}
                            source={require('../../logo/dark/logo_full_dark.png')}
                            resizeMode={'contain'}
                            fadeDuration={0}
                        /> : <Image
                            style={style.logo}
                            source={require('../../logo/light/logo_full_light.png')}
                            resizeMode={'contain'}
                            fadeDuration={0}
                        />
                    }

                </View>
            </View>
            <View style={style.right}>
                {props.pauseShown && <View style={style.pauseWrapper}>
                    <TouchableOpacity style={{ ...style.pause, backgroundColor: Theme(props.settings.darkMode).headerButtonsBackground }} onPress={() => { props.onPause() }}>
                        <FontAwesomeIcon icon={faPause} size={14} color={Theme(props.settings.darkMode).headerButtonsColor} />
                    </TouchableOpacity>
                </View>}
            </View>
        </View>
    );
}

Header.propTypes = {
    backShown: PropTypes.bool,
    pauseShown: PropTypes.bool,
}
Header.defaultProps = {
    backShown: false,
    pauseShown: false,
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
    }
};

export default connect(mapStateToProps)(Header);