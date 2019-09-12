import React from 'react'
import { View, Text } from 'native-base'

export default class Home extends React.Component{

    render(){
        return(
            <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text>Home</Text>
            </View>
        )
    }
}