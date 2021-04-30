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
  margin-bottom: 24px;
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
  background-color: white;
  margin-bottom: 32px;
  border-radius: 12px;
  padding: 16px;
`;

export const QuestionWrapper = styled.View`
  display: flex;
  width: 100%;
  margin-bottom: 12px;
  padding: 4px;
`;

export const QuestionLogo = styled.Image`
  display: flex;
  width: 30px;
  height: 8px;
`;

export const QuestionPlay = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  right: 12px;
  bottom: 2px;
  width: 54px;
  height: 54px;
  background-color: #0F7CBB;
  border-radius: 64px;
  position: absolute;
`;

export const QuestionTitle = styled.Text`
  display: flex;
  font-size: 15px;
`;

export const QuestionContent = styled.Text`
  display: flex;
  font-size: 14px;
  margin-top: 8px;
`;

export const QuestionHardnessTitle = styled.Text`
  display: flex;
  font-size: 14px;
  margin-top: 8px;
  font-weight: bold;
  color: ${props => {
    if (props.hardnessCode == 'ckolay') {
      return 'green'
    } else if (props.hardnessCode == 'kolay') {
      return 'green'
    } else if (props.hardnessCode == 'orta') {
      return '#D9C723'
    } else if (props.hardnessCode == 'zor') {
      return 'red'
    }
  }};;
`;

export const QuestionSep = styled.View`
  display: flex;
  height: 2px;
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
  background-color: #E3E3E3;
  margin-top: 6px;
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