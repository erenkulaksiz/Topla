import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const HeaderLogo = styled.Image`
  display: flex;
  width: 80px;
  height: 40px;
`;

export const Container = styled.View`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const HomeContainer = styled.View`
  display: flex;
  height: 100%;
  width: 100%;
  margin-top: 18px;
  padding-left: 24px;
  padding-right: 24px;
`;

export const QuestionsContainer = styled.ScrollView`
  display: flex;
  height: 100%;
  width: 100%;
  margin-top: 18px;
`;

export const HomeTitle = styled.Text`
  display: flex;
  width: 100%;
  color: #0F7CBB;
  font-size: 32px;
  font-weight: bold;
`;

export const Bar = styled.View`
  display: flex;
  height: 2px;
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
  background-color: #0F7CBB;
  margin-top: 6px;
`;

export const QuestionElement = styled.View`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: white;
  margin-bottom: 8px;
  border-radius: 12px;
  padding: 12px;
`;

/*

background-color: ${props => {
    if (props.hardnessCode == 'ckolay') {
      return 'red'
    } else {
      return 'white'
    }
  }};;

*/