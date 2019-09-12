import * as firebase from 'firebase';

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
        .then(success_callback, failed_callback);
    };

    createAccount = async user => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(user.email, user.password)
          .then(
            function() {
              console.log(
                'created user successfully. User email:' +
                  user.email +
                  ' name:' +
                  user.name
              );
              var userf = firebase.auth().currentUser;
              userf.updateProfile({ displayName: user.name }).then(
                function() {
                  console.log('Updated displayName successfully. name:' + user.name);
                  alert(
                    'User ' + user.name + ' was created successfully. Please login.'
                  );
                },
                function(error) {
                  console.warn('Error update displayName.');
                }
              );
            },
            function(error) {
              console.error('got error:' + typeof error + ' string:' + error.message);
              alert('Create account failed. Error: ' + error.message);
            }
          );
    };
      
    uploadImage = async uri => {
        console.log('got image to upload. uri:' + uri);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const ref = firebase
            .storage()
            .ref('avatar')
            .child(uuid.v4());
          const task = ref.put(blob);
      
          return new Promise((resolve, reject) => {
            task.on(
              'state_changed',
              () => {
      
              },
              reject,
              () => resolve(task.snapshot.downloadURL)
            );
          });
        } catch (err) {
          console.log('uploadImage try/catch error: ' + err.message);
        }
    };
      
    updateAvatar = url => {
      
        var userf = firebase.auth().currentUser;
        if (userf != null) {
          userf.updateProfile({ avatar: url }).then(
            function() {
              console.log('Updated avatar successfully. url:' + url);
              alert('Avatar image is saved successfully.');
            },
            function(error) {
              console.warn('Error update avatar.');
              alert('Error update avatar. Error:' + error.message);
            }
          );
        } else {
          console.log("can't update avatar, user is not login.");
          alert('Unable to update avatar. You must login first.');
        }
    };
}

const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;