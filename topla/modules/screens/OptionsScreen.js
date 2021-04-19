import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';

import { Container } from '../../styles'

class OptionsScreen extends React.Component {

    render() {
        return (
            <Container>
                <Text>Options</Text>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(OptionsScreen);