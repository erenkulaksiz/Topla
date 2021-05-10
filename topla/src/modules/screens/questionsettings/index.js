import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import style from './style';

class QuestionSettings extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <Text>{this.props.route.params.difficulty}</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSettings);