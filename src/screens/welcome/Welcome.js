import React from 'react';
import styled from 'styled-components/native'
import { smallLogo, bg2, cmp1, cmp2, cmp3} from '../../assets'

class Welcome extends React.Component {

    componentDidMount(){
        setTimeout(()=> {
            this.props.navigation.navigate('Login')
        }, 3000)
    }

    render(){
        return (
            <Container source={bg2}>
                <LogoContainer>
                    <Logo source={smallLogo} resizeMode="contain" />
                    <Slogan>Service above self</Slogan>
                </LogoContainer>
                <CompanyLogo source={cmp1} resizeMode="contain" />
                <CompanyLogo source={cmp2} resizeMode="contain" />
                <CompanyLogo source={cmp3} resizeMode="contain" />
            </Container>
        )
    }
}

export default Welcome;
const Container = styled.ImageBackground`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
`
const LogoContainer = styled.View`
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: 20;
    padding-bottom: 20;
`

const Logo = styled.Image`
    width: 60%;
    margin-bottom: 10;
`

const Slogan = styled.Text`
    text-align: center;
    font-size: 16;
    font-weight: bold;
    color: #850127;
    text-transform: capitalize;
    font-style: italic;
    margin-bottom: 30;
`

const CompanyLogo = styled.Image`
    width: 100%;
    margin-bottom: 10;
`