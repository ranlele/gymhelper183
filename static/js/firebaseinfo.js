var USER
var firstLoad = true

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('is login')
      USER = user;
      firebase.database().ref('users/' + USER.uid).update({
        username: USER.displayName,
        email: USER.email
      })
      // ...
    } else {
      console.log('is not login')
      USER = undefined
    }
    // This will make everything accessible from the js console;
    // for instance, self.x above would be accessible as APP.x
    if (firstLoad) {
      jQuery(function() {
        APP = app();
      });
      firstLoad = false
    }
  });
}

initApp()