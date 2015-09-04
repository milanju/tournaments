Template.register.events({
  'submit #register-form': function(event) {
    var username = event.target['register-username'].value;
    var password = event.target['register-password'].value;
    var confirm = event.target['register-confirm-password'].value;

    if(password !== confirm) {
      // passwords do not match
      return false;
    }

    Accounts.createUser({
      username: username,
      password: password
    }, function(err) {
      if(err) {
        // handle error
      } else {
        Router.go('/');
      }
    });

    return false;
  }
});
