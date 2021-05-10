import React from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView } from "react-native";
import style from './style';

import QuestionSlot from "../../questionslot";

// TODO: Eski header'ı sil

class HomeScreen extends React.Component {

    render() {
        return (
            <View style={style.container}>
                <View style={style.headerContainer}>
                    <Text style={style.headerText}>Ana Sayfa</Text>
                    <View style={style.headerBar}></View>
                </View>
                <ScrollView style={style.questionsScroll}>
                    <QuestionSlot
                        onPlay={() => { this.props.navigation.navigate('QuestionSettings', { name: 'Jane' }) }}
                        content={"+ Toplama - Çıkarma"}
                    />
                    <QuestionSlot
                        onPlay={() => { alert("hey") }}
                        content={"+ Toplama - Çıkarma"}
                    />
                    <QuestionSlot
                        onPlay={() => { alert("hey") }}
                        content={"+ Toplama - Çıkarma"}
                    />
                    <QuestionSlot
                        onPlay={() => { alert("hey") }}
                        content={"+ Toplama - Çıkarma"}
                    />

                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(HomeScreen);