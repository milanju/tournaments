Template.loginForm.events({
  'submit #login-form': function(event) {
    var username = event.target['login-username'].value;
    var password = event.target['login-password'].value;
    Meteor.loginWithPassword(username, password);
    return false;
  },
  'click #logout-button': function() {
    Meteor.logout();
  }
});
