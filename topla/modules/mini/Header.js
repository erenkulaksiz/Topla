import React from 'react';
import { HeaderContainer, HeaderLogo } from '../../styles';

class Header extends React.Component {
    render() {
        return (
            <HeaderContainer>
                <HeaderLogo source={require('../../src/logo_full.png')} />
            </HeaderContainer>
        );
    }
}

export default Header