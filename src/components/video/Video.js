import * as React from 'react';
import { Video } from 'expo-av';

class VideoView extends React.Component {

    render(){
        const { props } = this
        return (
            <Video
                source={{ uri: props.source }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                useNativeControls
                isLooping
                resizeMode={Video.RESIZE_MODE_CONTAIN}
                style={{ width: props.width, height: props.height }}
            />
        )
    }
}

export default VideoView;