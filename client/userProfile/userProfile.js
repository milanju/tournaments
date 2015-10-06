Template.userProfile.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var username = FlowRouter.getParam('username');
    self.subscribe('singleUser', username);
  });
});

Template.userProfile.helpers({
  user: function() {
    var username = FlowRouter.getParam('username');
    return Meteor.users.findOne({username: username});
  }
});
