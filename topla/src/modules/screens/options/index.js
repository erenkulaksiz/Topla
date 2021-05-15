import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSync, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

class OptionsScreen extends React.Component {

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
                        <TouchableOpacity style={style.button}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faSync} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Aboneliği Geri Yükle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...style.button, backgroundColor: "#fff" }}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faBell} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Bildirimler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.button}>
                            <View style={style.buttonIcon}>
                                <FontAwesomeIcon icon={faEnvelope} size={16} color={"#000"} />
                            </View>
                            <Text style={style.buttonText}>Destek</Text>
                        </TouchableOpacity>
                    </View>
                    <View>

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