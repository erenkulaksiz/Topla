import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';
import style from './style';

import Header from "../../header";

class QuestionSettings extends React.Component {

    render() {

        return (
            <View style={style.container}>
                <Header backShown={true} onBack={() => { this.props.navigation.goBack() }} />
                <View style={style.headerContainer}>
                    <View>
                        <Text style={style.headerText}>Soru Ayarları</Text>
                    </View>
                    <View style={style.headerTextWrapperRight}>
                        <Text style={style.headerTextQuestionSettings}>Varsayılan Ayarlar - {this.props.route.params.question.name}</Text>
                    </View>
                </View>
                <View style={style.headerBar}></View>
                <View style={style.content}>
                    <Button title='arttır' onPress={() => { this.props.dispatch({ type: 'ARTTIR' }) }} />
                    <Button title='azalt kardes' onPress={() => { this.props.dispatch({ type: 'AZALT' }) }} />
                    <Text>{this.props.reducer.value}</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSettings);