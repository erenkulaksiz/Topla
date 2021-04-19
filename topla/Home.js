import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';

class Home extends React.Component {

    render() {
        //console.log(this.props.subjects.current);
        return (
            <View>
                <Text> You have {this.props.subjects.current.length} tasks. </Text>
                <Button
                    title="Select more subjects"
                    onPress={() =>
                        this.props.navigation.navigate('Subjects')
                    }
                />
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    const { subjects } = state
    return { subjects }
};

export default connect(mapStateToProps)(Home);