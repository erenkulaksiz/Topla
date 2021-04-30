import React from 'react';
import { connect } from 'react-redux';
import { Container, HomeContainer, QuestionsContainer, HomeTitle, Bar } from '../../styles'
import QuestionSlot from '../mini/QuestionSlot';

class HomeScreen extends React.Component {

    render() {
        return (
            <Container>
                <HomeContainer>
                    <HomeTitle>Ana Sayfa</HomeTitle>
                    <Bar />
                    <QuestionsContainer
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}>
                        <QuestionSlot
                            hardness={'Çok Kolay'}
                            hardnessCode={'ckolay'}
                            onPlay={() => { alert("asdas") }}
                            content={'+ Toplama - Çıkarma'}
                        />
                        <QuestionSlot
                            hardness={'Kolay'}
                            hardnessCode={'kolay'}
                            onPlay={() => { console.log("mucuklar") }}
                            content={'+ Toplama - Çıkarma'}
                        />
                        <QuestionSlot
                            hardness={'Orta'}
                            hardnessCode={'orta'}
                            onPlay={() => { console.log("mucuklar") }}
                            content={'+ Toplama - Çıkarma'}
                        />
                        <QuestionSlot
                            hardness={'Zor'}
                            hardnessCode={'zor'}
                            onPlay={() => { console.log("mucuklar") }}
                            content={'+ Toplama - Çıkarma'}
                        />
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