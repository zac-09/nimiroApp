import React from 'react';
import { TouchableWithoutFeedback, View, Image, TouchableHighlight } from 'react-native';
import { Text, Right } from 'native-base';
import { Badge } from 'react-native-elements';

const ChatItem = props => (
    <TouchableHighlight onPress={() => props.onItemPressed(props.id)} activeOpacity={0.985} underlayColor='#06545A'>
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.avator} source={{uri: props.avator}}/>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={{fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 20, marginTop: 5}}>{props.name}</Text>
                    <Text numberOfLines={1} style={{ width: 200, color: 'gray', fontSize: 13 }}>{props.desc}</Text>
                </View>
                <Right>
                    <View style={styles.detailContainer}>
                        <Text style={{color: '#53C41A', marginBottom: 20, marginTop: 5}}>{props.time}</Text>
                        {props.unread > 0 && <Badge value={props.unread} status="success" />}
                    </View>
                </Right>
            </View>
        </View>
    </TouchableHighlight>
)

export default ChatItem;

const styles = {
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden'
    },
    avator: {
        width: '100%',
        height: '100%'
    },
    contentContainer: {
        marginLeft: 10,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        height: 80,
        flex: 1
    },
    textContainer: {
        justifyContent: 'flex-start',
    },
    detailContainer: {
        justifyContent: 'flex-start',
        height: 80,
    }

}