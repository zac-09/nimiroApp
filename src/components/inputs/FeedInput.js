import * as React from 'react';
import { View, Thumbnail, Text } from 'native-base';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

const FeedInput = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Thumbnail small source={props.avator}/>
                <TouchableWithoutFeedback onPress={props.createPost}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Share your mind?</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}
export default FeedInput;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        flexDirection: 'column',
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 5
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 10,
        height: 60,
        width: '100%',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        height: 40,
        marginStart: 10,
        justifyContent: 'center',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(205, 210, 214, 0.5)',
    },
    text: {
        fontFamily: 'Roboto',
        fontSize: 15,
        color: 'rgb(18, 18, 18)'
    }
})