import React from 'react';
import { connect } from 'react-redux';

import {
    QuestionElement,
    QuestionPlay,
    QuestionWrapper,
    QuestionLogo,
    QuestionTitle,
    QuestionSep,
    QuestionContent,
    QuestionHardnessTitle,
} from '../../styles'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

class QuestionSlot extends React.Component {

    render() {
        return (
            <QuestionWrapper>
                <QuestionElement
                    hardnessCode={this.props.hardnessCode}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.4,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>

                    <QuestionLogo style={{ opacity: .2 }} source={require('../../src/tc.png')} />
                    <QuestionTitle>Zorluk Seviyesi: <QuestionHardnessTitle hardnessCode={this.props.hardnessCode}>{this.props.hardness}</QuestionHardnessTitle></QuestionTitle>
                    <QuestionSep />
                    <QuestionContent>İçerik: {this.props.content}</QuestionContent>
                </QuestionElement>
                <QuestionPlay style={{ elevation: 5 }} onPress={() => { this.props.onPlay() }} >
                    <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
                </QuestionPlay>
            </QuestionWrapper>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSlot);