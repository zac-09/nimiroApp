import React from 'react';
import splash from '../../../assets/splash.png'
import wheels from '../../assets/wheels.png'
import { StyleSheet, ImageBackground, Image } from 'react-native';

class Welcome extends React.Component {

    componentDidMount(){
        setTimeout(()=> {
            this.props.navigation.navigate('Login')
        }, 3000)
    }

    render(){
        return (
            <ImageBackground style={styles.container} source={splash}>
                <Image style={styles.wheel} source={wheels} resizeMode='contain'/>
            </ImageBackground>
        )
    }
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wheel: {
        width: 300,
        height: 300
    }
})