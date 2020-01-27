import React from 'react';
import splash from '../../../assets/splash.png'
import { StyleSheet, ImageBackground } from 'react-native';

class Welcome extends React.Component {

    componentDidMount(){
        setTimeout(()=> {
            this.props.navigation.navigate('Login')
        }, 3000)
    }

    render(){
        return (
            <ImageBackground style={styles.container} source={splash}/>
        )
    }
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0
    }
})