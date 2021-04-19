import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';

import { QuestionElement } from '../../styles'

class QuestionSlot extends React.Component {

    render() {
        return (
            <QuestionElement hardnessCode={this.props.hardnessCode}>
                <Text>{this.props.hardness}</Text>
            </QuestionElement>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSlot);