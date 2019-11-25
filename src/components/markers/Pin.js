import * as React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const Pin = ({color}) => {
    return (
        <FontAwesome name='map-pin' size={32} color={color}/>
    )
}

export default Pin