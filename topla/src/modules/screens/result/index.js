import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';
import style from './style';

import Header from "../../header";

class ResultScreen extends React.Component {

    _navigateToHome = () => {
        this.props.navigation.navigate('Home');
        console.log("@results back to home");
    }

    componentDidMount() {
        //this._resetNav();
    }

    render() {
        return (
            <View style={style.container}>
                <Header />
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Sonuçlar</Text>
                    <View style={style.headerBar}></View>
                </View>
                <View style={style.content}>
                    <Text>sonuçlar</Text>
                    <Button title={"ana sayfa"} onPress={() => this._navigateToHome()}></Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(ResultScreen);