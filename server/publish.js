Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {accounts: 1}});
});

Meteor.publish('singleUser', function(username) {
  return Meteor.users.find({username: username});
});

Meteor.publish('tournaments', function() {
  return Tournaments.find();
});

Meteor.publish('singleTournament', function(tournamentId) {
  return Tournaments.find({_id: tournamentId});
});
