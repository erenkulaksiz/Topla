import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';

class Subjects extends React.Component {
    render() {
        return (
            <View>
                <Text>Select Subjects Below!</Text>

                {
                    this.props.subjects.all_subjects.map((subject, index) => (
                        <Button
                            key={subject}
                            title={`Add ${subject}`}
                            onPress={() =>
                                this.props.dispatch({
                                    type: 'SELECT_SUBJECT',
                                    payload: index,
                                })
                            }
                        />
                    ))
                }

                <Button
                    title="Back to home"
                    onPress={() =>
                        this.props.navigation.navigate('Home')
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

export default connect(mapStateToProps)(Subjects);