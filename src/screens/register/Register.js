import React from 'react'
import { View, Text } from 'native-base'
import { SafeAreaView } from "react-navigation";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Forms } from '../../components'
import { logo, bg2} from '../../assets'
import { ImageBackground, KeyboardAvoidingView } from 'react-native'
import firebaseSDK from '../../backend/Firebase';
import Toast from 'react-native-root-toast';
import AnimatedLoader from "react-native-animated-loader";
import { validator, formatPhoneNumber } from '../../utils/Validations';
import Storage from '../../utils/Storage';
import * as firebase from 'firebase';

export default class Register extends React.Component{

    state = {
        fName: '',
        fNameError: null,
        lName: '',
        lNameError: null,
        dName: '',
        dNameError: null,
        phoneNumber: '',
        gender: 'male',
        rotaryLevel: '',
        club: '',
        fraternity: '',
        buddy: '',
        classification: '',
        email: '',
        emailError: null,
        password: '',
        confirmPassword: '',
        passwordError: null,
        genderIndex: 0,
        rotaryLevelIndex: 0,
        image: PROFILE_IMAGE,
        loading: false,
        checked: false
    }

    navigate = route => {
        this.props.navigation.navigate(route)
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    signUp = () => {
        //do signup here
        const { email, password, dName, phoneNumber, emailError, passwordError, fNameError, lNameError, dNameError } = this.state;
        const isValid = !(emailError || passwordError || fNameError || lNameError || dNameError)
        if(isValid === true){
            this.setState({loading: true})
            const user = {
                email,
                password,
                name: dName,
                phone: formatPhoneNumber(phoneNumber)
            }
            firebaseSDK.createAccount(user, this.uploadUserImage, this.failure)
        }else {
            this.showToast("Some fields are invalid")
        }
    }

    uploadUserImage = async(uid) => {

        await Storage.set('uid', uid)
        const { image } = this.state

        if(image !== PROFILE_IMAGE){
            firebaseSDK.uploadAvator(image, this.uploadUserData, this.failure)
        }else {
            this.uploadUserData('')
        }
    }

    uploadUserData = avatar => {
        const { fName, lName, dName, phoneNumber, gender} = this.state;
        let _id = firebase.auth().currentUser.uid

        const data = {
            fName,
            lName,
            name: dName,
            phoneNumber: formatPhoneNumber(phoneNumber),
            gender,
            avatar,
            _id
        }
      
        firebaseSDK.uploadUserData(data, this.success, this.failure)
    }


    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
            this.showToast('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          this.setState({ image: result.uri });
        }
    };

    showToast = message => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }

    success = () => {
        this.setState({loading: false});
        this.navigate('User');
    }

    failure = async (error) => {
        await firebaseSDK.deleteAccount();
        this.setState({loading: false});
        this.showToast(error.toString());
    }

    render(){
        const { 
            loading, 
            image, 
            fName, 
            fNameError,
            lName, 
            lNameError,
            dName, 
            dNameError,
            phoneNumber, 
            gender, 
            confirmPassword,
            email, 
            emailError,
            password, 
            passwordError,
            checked,
            genderIndex, } = this.state;
        return(
            <SafeAreaView
                style={{flex: 1, height: '100%' }}
                forceInset={{ top: "never" }}
            >
                <KeyboardAwareScrollView
                    style={{flex: 1, minHeight: '100%'}}
                >
                <View style={{width: '100%', height: '100%'}}>
                    <View style={styles.container}>
                        <Forms.AvatorForm 
                            changeAvator={() => this._pickImage()}
                            avator={image}/>
                        <Forms.RegisterForm
                            fName={fName}
                            fNameError={fNameError}
                            lName={lName}
                            lNameError={lNameError}
                            dName={dName}
                            dNameError={dNameError}
                            phoneNumber={phoneNumber}
                            gender={gender}
                            email={email} 
                            emailError={emailError}
                            password={password}
                            passwordError={passwordError}
                            confirmPassword={confirmPassword}
                            checked={checked}
                            genderIndex={genderIndex}
                            onEmailChange={ text => this.setState({ email: text, emailError: validator('email', text)})}
                            onPasswordChange={ text => this.setState({ password: text, passwordError: validator('password', text)})}
                            onConfirmPasswordChange={ text => this.setState({ confirmPassword: text})}
                            onFNameChange={text => this.setState({fName: text, fNameError: validator('required', text)})}
                            onLNameChange={text => this.setState({lName: text, lNameError: validator('required', text)})}
                            onDNameChange={text => this.setState({dName: text, dNameError: validator('required', text)})}
                            onChangePhoneNumber={text => this.setState({phoneNumber: text})}
                            onChangeGender={(value, index) => this.setState({gender: value, genderIndex: index})}
                            onAgreeChange={() => this.setState(prev => ({ checked: !prev.checked}))}
                            onSubmitPress={() => this.signUp()}
                        />
                    </View>
                </View>
                </KeyboardAwareScrollView>
                <AnimatedLoader
                    visible={loading}
                    overlayColor="rgba(0,0,0,0.25)"
                    source={require("../../assets/anim/trail_loading.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
            </SafeAreaView>
        )
    }
}

const styles = {
    container: {
        flex: 1
    },
    lottie: {
        width: 200,
        height: 200
    }
}

const PROFILE_IMAGE = 'https://images.pexels.com/photos/2601464/pexels-photo-2601464.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
