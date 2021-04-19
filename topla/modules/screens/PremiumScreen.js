import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';

import { Container } from '../../styles'

class PremiumScreen extends React.Component {

    render() {
        return (
            <Container>
                <Text>Premium</Text>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};

export default connect(mapStateToProps)(PremiumScreen);