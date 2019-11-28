import * as React from 'react'
import { View } from 'native-base';
import PostHeader from '../../components/headers/PostHeader';

class Post extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: "rgba(0, 8, 228, 0.7)",}}>
                <PostHeader 
                    title='Create post' 
                    nomargin 
                    goBack={this.props.navigation.goBack}
                    createPost={() => {}}/>
            </View>
        )
    }
}

export default Post;