import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import style from './style';

import Header from "../../header";

class PremiumScreen extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Premium</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <Text>asdsa</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(PremiumScreen);