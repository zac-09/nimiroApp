import React from 'react'
import { View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProgressiveImage from '../images/ProgressiveImage'

const avator = ({avator, changeAvator}) => {
    return (
        <View style={styles.container}>
            <View style={styles.positionContainer}>
                <View style={styles.avator}>
                    <ProgressiveImage style={styles.image} source={{uri: avator}} thumbnail={require('../../../assets/images/placeholder.png')}/>
                </View>
                <View style={styles.iconContainer}>
                    <Ionicons name='ios-camera' size={48} onPress={() => changeAvator()} color='white'/>
                </View>
            </View>
        </View>
    )
}

export default avator;

const IMAGE_DIMENSIONS = 200;
const ICON_DIMENSIONS = 60;

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    avator: {
        width: IMAGE_DIMENSIONS,
        height: IMAGE_DIMENSIONS,
        borderRadius: IMAGE_DIMENSIONS / 2,
        overflow: 'hidden',
    },
    positionContainer: {
        position: 'relative',
        flexWrap: 'wrap'
    },
    image: {
        width: IMAGE_DIMENSIONS,
        height: IMAGE_DIMENSIONS
    },
    iconContainer: {
        width: ICON_DIMENSIONS,
        height: ICON_DIMENSIONS,
        borderRadius: ICON_DIMENSIONS / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4169E1',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        right: 0
    }
}