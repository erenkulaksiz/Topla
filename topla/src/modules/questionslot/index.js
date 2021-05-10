import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TouchableOpacity, Image } from "react-native";
import style from './style';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'


class QuestionSlot extends React.Component {

    render() {

        const {
            onPlay,
            content,
        } = this.props

        return (
            <View style={style.container}>
                <View style={style.element}>
                    <Image
                        style={style.elementLogo}
                        source={require('../../tc.png')}
                    />
                    <Text style={style.elementHardness}>Zorluk Seviyesi: Kolay</Text>
                    <View style={style.elementBar} />
                    <Text style={style.elementContent}>İçerik: {content}</Text>
                    <Text style={style.elementBasamak}>Basamak Sayısı: 1</Text>
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
    content: PropTypes.string,
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(QuestionSlot);