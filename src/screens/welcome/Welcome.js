import React from 'react'
import { View, Text } from 'native-base'

export default class Welcome extends React.Component{

    render(){
        return(
            <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text>Welcome</Text>
            </View>
        )
    }
}