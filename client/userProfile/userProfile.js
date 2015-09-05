Template.userProfile.helpers({
  user: function() {
    var username = Iron.controller().getParams().username;
    return Meteor.users.findOne({username: username});
  }
});
