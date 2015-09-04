Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {accounts: 1}});
});

Meteor.publish('singleUser', function(username) {
  return Meteor.users.findOne({username: username});
});
