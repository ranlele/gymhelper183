// // FirebaseUI config.
// var uiConfig = {
//   callbacks: {
//     signInSuccess: function(currentUser, credential, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function() {
//       // The widget is rendered.
//       // Hide the loader.
//       // document.getElementById('loader').style.display = 'none';
//     }
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: 'default',
//   signInSuccessUrl: 'http://127.0.0.1:8000/gymhelper183/default/index',
//
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//
//   ],
//   // Terms of service url.
//   tosUrl: '<your-tos-url>'
// };
//
// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// // The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);
var uiConfig = {
  signInSuccessUrl: 'http://127.0.0.1:8000/gymhelper183/default/index',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,

  ],
  signInFlow: 'popup',
  signInSuccessUrl: 'http://127.0.0.1:8000/gymhelper183/default/index',
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);