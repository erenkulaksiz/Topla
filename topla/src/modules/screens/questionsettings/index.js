import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, TouchableOpacity, ScrollView, Image } from 'react-native';
import style from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Header from "../../header";

class QuestionSettings extends React.Component {

    _navigateToQuestion = question => {
        this.props.navigation.navigate('QuestionScreen', { question: question })
    }

    render() {

        return (
            <View style={style.container}>
                <Header backShown onBack={() => this.props.navigation.goBack()} />
                <View style={style.headerContainer}>
                    <View>
                        <Text style={style.headerText}>Soru Ayarları</Text>
                    </View>
                    <View style={style.headerTextWrapperRight}>
                        <Text style={style.headerTextQuestionSettings}>Varsayılan Ayarlar - {this.props.route.params.question.name}</Text>
                    </View>
                </View>
                <View style={style.headerBar}></View>
                <ScrollView style={style.content}>
                    <View style={style.questionSettingsWrapper}>
                        <Image
                            style={style.elementLogo}
                            source={require('../../../tc.png')}
                        />
                    </View>
                </ScrollView>
                <View style={style.bottomButtonWrapper}>
                    <TouchableOpacity style={style.bottomButton} onPress={() => this._navigateToQuestion(this.props.route.params.question)}>
                        <FontAwesomeIcon icon={faPlay} size={12} color={"#fff"} />
                        <Text style={{ fontSize: 15, color: "#fff", marginLeft: 8 }}>Çözmeye Başla</Text>
                    </TouchableOpacity>
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