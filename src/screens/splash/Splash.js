import React from 'react';
import styled from 'styled-components/native'
import { logo, bg2} from '../../assets'

class Splash extends React.Component {

    render(){
        return (
            <Container source={bg2}>
                <Header>Welcome to RotaApp</Header>
                <Logo source={logo}/>
                <Slogan>Service above self</Slogan>
            </Container>
        )
    }
}

export default Splash;
const Container = styled.ImageBackground`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`

const Header = styled.Text`
    text-align: center;
    font-size: 25;
    font-weight: bold;
    color: #fff;
    margin-bottom: 50;
`

const Logo = styled.Image`
    width: 100%;
    margin-bottom: 20;
`

const Slogan = styled.Text`
    text-align: center;
    font-size: 16;
    font-weight: bold;
    color: #850127;
    text-transform: capitalize;
    font-style: italic;
`