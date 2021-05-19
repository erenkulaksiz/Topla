import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, faBell, faEnvelope, faCrown } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

class OptionsScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    _checkConnection = () => {
        return this.props.reducer.connection.isConnected
    }

    _navigateToPremium = () => {
        if (this._checkConnection()) {
            this.props.navigation.navigate('PremiumScreen');
        } else {
            alert("İnternet bağlantınızı kontrol ediniz");
        }
    }

    _navigateToContact = () => {
        this.props.navigation.navigate('ContactScreen');
    }

    _refreshPremium = () => {
        if (this._checkConnection()) {
            this.props.navigation.navigate('PremiumScreen');
        } else {
            alert("İnternet bağlantınızı kontrol ediniz");
        }
    }

    render() {
        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Ayarlar</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <View style={style.buttonsWrapper}>
                        <TouchableOpacity style={style.button} onPress={() => this._refreshPremium()}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faSync} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Aboneliği Geri Yükle</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faBell} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Bildirimler</Text>
                        </TouchableOpacity>*/}
                        <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }} onPress={() => this._navigateToContact()}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faEnvelope} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>İletişim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...style.button }} onPress={() => this._navigateToPremium()}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faCrown} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Reklamları Kaldır</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.altContent}>
                        <Text>asdas</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(OptionsScreen);