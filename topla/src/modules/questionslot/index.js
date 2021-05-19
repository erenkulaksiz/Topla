import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Image } from "react-native";
import style from './style';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import I18n from "../../utils/i18n.js";

class QuestionSlot extends React.Component {

    render() {

        const {
            onPlay,
            question,
        } = this.props

        return (
            <View style={style.container}>
                <View style={style.element}>
                    <Image
                        style={style.elementLogo}
                        source={require('../../tc.png')}
                    />
                    <Text style={style.elementHardness}>{I18n.t("question_hardnessLevel")} <Text style={{ color: question.titleColor, fontWeight: "bold" }}>{question.name}</Text></Text>
                    <View style={style.elementBar} />
                    <Text style={style.elementContent}>{I18n.t("question_content")} {question.content}</Text>
                    <Text style={style.elementBasamak}>{I18n.t("question_digit")} {question.digit}</Text>
                </View>
                <TouchableOpacity style={style.play} onPress={() => { onPlay() }}>
                    <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
                </TouchableOpacity>
            </View>
        );
    }
}

QuestionSlot.propTypes = {
    onPlay: PropTypes.func,
    question: PropTypes.object,
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSlot);