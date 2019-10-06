import React from 'react';
import { createAppContainer } from 'react-navigation';
import { HomeStack } from '../../navigations/AppNavigator'
import { ImageBackground } from 'react-native';
import { bg2 } from '../../assets';
import Header from '../../components/headers/Header'

const MainStack = createAppContainer(HomeStack);

const Main = props => (
    <ImageBackground source={bg2} style={{flex: 1}}>
        <Header nomargin title='RotaApp'/>
        <MainStack/>
    </ImageBackground>
)

export default Main;