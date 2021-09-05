import React from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import I18n from "../../utils/i18n.js";
import style from './style';
import Theme from '../../themes'

const QuestionSlot = props => {
    return (
        <TouchableOpacity style={{ ...style.container, shadowColor: props.settings.darkMode ? "#FFF" : "#919191" }}
            activeOpacity={0.7}
            onPress={() => props.onPlay()}>
            <View style={{
                ...style.element,
                backgroundColor: Theme(props.settings.darkMode).questionSlotBackground
            }}>
                <Image style={style.elementLogo} source={require('../../tc.png')} />
                { // #TODO: make a proper requires premium alert
                    (props.question.requiresPremium && props.API.DATA.hasPremium == false) && <Text>You need to buy premium to reach this type of question.</Text>
                }
                <Text style={{ ...style.elementHardness, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_hardnessLevel")} <Text style={{ color: props.question.titleColor, fontWeight: "bold" }}>{props.question.name}</Text></Text>
                <View style={style.elementBar} />
                <Text style={{ ...style.elementContent, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_content")} <Text style={{ flex: 1, fontSize: 12 }}>{props.question.content}</Text></Text>
                <Text style={{ ...style.elementBasamak, color: Theme(props.settings.darkMode).textDefault }}>{I18n.t("question_digit")} <Text style={{ flex: 1 }}>{props.question.digit}</Text></Text>
            </View>
            <View style={style.play}>
                <FontAwesomeIcon icon={faPlay} size={18} color={'white'} />
            </View>
        </TouchableOpacity>
    );
}

QuestionSlot.propTypes = {
    onPlay: PropTypes.func,
    question: PropTypes.object,
}

const mapStateToProps = (state) => {
    return {
        reducer: state.mainReducer,
        settings: state.settings,
        API: state.API,
    }
};

export default connect(mapStateToProps)(QuestionSlot);