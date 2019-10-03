import React from 'react'
import { View, Text } from 'native-base'
import { SafeAreaView } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Forms } from '../../components'
import { logo, bg2} from '../../assets'
import { ImageBackground } from 'react-native'

export default class Register extends React.Component{

    state = {
        fName: '',
        lName: '',
        dName: '',
        phoneNumber: '',
        gender: 'male',
        rotaryLevel: '',
        club: '',
        fraternity: '',
        buddy: '',
        classification: '',
        email: '',
        password: '',
        genderIndex: 0,
        rotaryLevelIndex: 0
    }

    render(){
        const {fName, lName, dName, phoneNumber, gender, rotaryLevel, club, fraternity, buddy, classification, email, password, genderIndex, rotaryLevelIndex} = this.state;
        return(
            <SafeAreaView
                style={{ backgroundColor: "#FFF", flex: 1 }}
                forceInset={{ top: "never" }}
            >
                <KeyboardAwareScrollView
                    enableOnAndroid
                    enableAutomaticScroll
                    keyboardOpeningTime={0}
                >
                <ImageBackground style={{width: '100%', height: '100%'}} source={bg2}>
                    <View style={styles.container}>
                        <Forms.AvatorForm 
                            avator={PROFILE_IMAGE}/>
                        <Forms.RegisterForm
                            fName={fName}
                            lName={lName}
                            dName={dName}
                            phoneNumber={phoneNumber}
                            gender={gender}
                            rotaryLevel={rotaryLevel}
                            club={club}
                            fraternity={fraternity}
                            buddy={buddy}
                            classification={classification}
                            email={email} 
                            password={password}
                            genderIndex={genderIndex}
                            rotaryLevelIndex={rotaryLevelIndex}
                            onEmailChange={ text => this.setState({ email: text})}
                            onPasswordChange={ text => this.setState({ password: text})}
                            onFNameChange={text => this.setState({fName: text})}
                            onLNameChange={text => this.setState({lName: text})}
                            onDNameChange={text => this.setState({dName: text})}
                            onChangePhoneNumber={text => this.setState({phoneNumber: text})}
                            onChangeGender={(value, index) => this.setState({gender: value, genderIndex: index})}
                            onChangeRotaryLevel={(value, index) => this.setState({rotaryLevel: value, rotaryLevelIndex: index})}
                            onChangeClub={text => this.setState({club: text})}
                            onChangeFraternity={text => this.setState({fraternity: text})}
                            onChangeBuddy={text => this.setState({buddy: text})}
                            onChangeClassification={text => this.setState({classification: text})}
                        />
                    </View>
                </ImageBackground>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

const styles = {
    container: {
        flex: 1
    }
}

const PROFILE_IMAGE = {uri: 'https://images.pexels.com/photos/2601464/pexels-photo-2601464.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}
