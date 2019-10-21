import * as firebase from 'firebase';
import { Platform } from 'react-native';
import 'firebase/firestore';
import Storage from '../utils/Storage'

class FirebaseSDK {
    constructor() {
        if (!firebase.apps.length) {
            //avoid re-initializing
            firebase.initializeApp({
                apiKey: "AIzaSyC82i6QjDXfyEs0XO_lt44bV8mt2J1iTsg",
                authDomain: "cbt-messenger.firebaseapp.com",
                databaseURL: "https://cbt-messenger.firebaseio.com",
                projectId: "cbt-messenger",
                storageBucket: "cbt-messenger.appspot.com",
                messagingSenderId: "940970629950",
                appId: "1:940970629950:web:e119a54333a6c4cf626a6f"
            });
        }
    }

    login = async (user, success_callback, failed_callback) => {
      await firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
          const uid = firebase.auth().currentUser.uid
          return success_callback(uid)
        }, failed_callback);
    };

    createAccount = async (user, success_callback, failed_callback) => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(user.email, user.password)
          .then(
            function() {
              console.log(
                'created user successfully. User email:' +
                  user.email 
              );
              const userf = firebase.auth().currentUser;
              userf.updateProfile({ displayName: user.name }).then(
                function() {
                  console.log('Updated displayName successfully. name:' + user.name);
                  success_callback(userf.uid);
                },
                function(error) {
                  failed_callback(error.message)
                }
              );
            },
            function(error) {
              console.error('got error:' + typeof error + ' string:' + error.message);
              failed_callback(error.message)
            }
          );
    };

    deleteAccount = async () => {
      var user = firebase.auth().currentUser;

      await user.delete().then(function() {
        // User deleted.
      }).catch(function(error) {
        // An error happened.
      });
    }

    uploadAvator = async (uri, success_callback, failed_callback) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const uid = firebase.auth().currentUser.uid
      const that = this

      const response = await fetch(uploadUri);
      const blob = await response.blob();

      const imageRef = firebase.storage().ref('avatar').child(uid)

      return imageRef.put(blob)
                .then( async() => {
                  let url = ''
                  await imageRef.getDownloadURL().then(res => url = res).catch(() => console.log('Error occured'));
                  console.log(url);
                  that.updateAvatar(url, success_callback, failed_callback);
                }, 
                       error => failed_callback(error.message)
                )
                .catch( error => failed_callback(error.message))
    };
      
    updateAvatar = (url, success_callback, failed_callback) => {
      
        var userf = firebase.auth().currentUser;
        if (userf != null) {
          userf.updateProfile({ photoURL: url }).then(
            function() {
              console.log('Updated avatar successfully. url:' + url);
              success_callback(url)
            },
            function(error) {
              console.warn('Error update avatar.');
              failed_callback(error.message)
            }
          ).catch( error => failed_callback(error.message));
        } else {
          console.log("can't update avatar, user is not login.");
          failed_callback('Unable to update avatar. You must sign up first.');
        }
    };

    uploadUserData = (data, success_callback, failed_callback) => {
      const uid = firebase.auth().currentUser.uid
      firebase.firestore().collection("user_data").doc(uid).set({
          ...data,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      })
      .then(function() {
          console.log("Document successfully written!");
          success_callback()
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
          failed_callback(error.message)
      });
    }

    uploadBlob = async (uri, id, success_callback, failed_callback) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const that = this

      const response = await fetch(uploadUri);
      const blob = await response.blob();

      const imageRef = firebase.storage().ref('media').child(id)

      return imageRef.put(blob)
                .then( async() => {
                  let url = ''
                  await imageRef.getDownloadURL().then(res => url = res).catch(() => console.log('Error occured'));
                  console.log(url);
                  success_callback(url);
                }, 
                       error => failed_callback(error.message)
                )
                .catch( error => failed_callback(error.message))
    };

}

const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;