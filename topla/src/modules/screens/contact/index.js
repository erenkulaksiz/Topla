import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import style from './style';

import Header from "../../header";

class ContactScreen extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <Header backShown={true} onBack={() => { this.props.navigation.goBack() }} />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>İletişim</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <Text>Contact</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(ContactScreen);