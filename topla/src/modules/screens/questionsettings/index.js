import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import style from './style';

import Header from "../../header";

class QuestionSettings extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <Header backShown={true} onBack={() => { this.props.navigation.goBack() }} />
                <Text>{this.props.route.params.question.name}</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSettings);