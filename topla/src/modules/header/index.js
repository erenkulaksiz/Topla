import React from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types';

class Header extends React.Component {


    render() {

        const {
            backShown,
            onBack,
        } = this.props

        return (
            <View style={style.container}>
                <View style={style.left}>
                    {backShown && <View style={style.backWrapper}>
                        <TouchableOpacity style={style.back} onPress={() => { onBack() }}>
                            <FontAwesomeIcon icon={faArrowLeft} size={18} color={'black'} />
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                <View style={style.middle}>
                    <View style={style.logoWrapper}>
                        <Image
                            style={style.logo}
                            source={require('../../logo_full.png')}
                            resizeMode={'contain'}
                        />
                    </View>
                </View>
                <View style={style.right}>

                </View>
            </View>
        );
    }
}

Header.propTypes = {
    backShown: PropTypes.bool,
    onBack: PropTypes.func,
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(Header);