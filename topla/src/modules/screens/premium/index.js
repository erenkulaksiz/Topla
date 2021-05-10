import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import style from './style';

class PremiumScreen extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Premium</Text>
                    <View style={style.headerBar}></View>
                </View>
                <Text>premi</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(PremiumScreen);