import React from 'react'
import { View, Text } from 'native-base'
import { Forms } from '../../components'
import { logo, bg2} from '../../assets'
import { ImageBackground } from 'react-native'

export default class Register extends React.Component{

    render(){
        return(
            <ImageBackground style={{width: '100%', height: '100%'}} source={bg2}>
                <View style={styles.container}>
                    <Forms.AvatorForm avator={{uri: 'https://images.pexels.com/photos/2601464/pexels-photo-2601464.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}}/>
                </View>
            </ImageBackground>
        )
    }
}

const styles = {
    container: {
        width: '100%',
        height: '100%'
    }
}