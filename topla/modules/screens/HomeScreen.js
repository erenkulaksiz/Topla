import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';

import { Container, HomeContainer, QuestionsContainer, HomeTitle, Bar } from '../../styles'
import QuestionSlot from '../mini/QuestionSlot';

class HomeScreen extends React.Component {

    render() {
        return (
            <Container>
                <HomeContainer>
                    <HomeTitle>Ana Sayfa</HomeTitle>
                    <Bar />
                    <QuestionsContainer>
                        <QuestionSlot hardness={'Çok Kolay'} hardnessCode={'ckolay'} />
                        <QuestionSlot hardness={'Kolay'} hardnessCode={'kolay'} />
                        <QuestionSlot hardness={'Orta'} hardnessCode={'orta'} />
                    </QuestionsContainer>
                </HomeContainer>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(HomeScreen);