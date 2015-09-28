Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {accounts: 1}});
});

Meteor.publish('singleUser', function(username) {
  return Meteor.users.find({username: username});
});

Meteor.publish('tournaments', function() {
  return Tournaments.find({isTemplate: false});
});

Meteor.publish('singleTournament', function(tournamentId) {
  return Tournaments.find({_id: tournamentId});
});

Meteor.publish('templates', function() {
  if(Roles.userIsInRole(this.userId, ['admin'])) {
    return Tournaments.find({isTemplate: true});
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('singleTemplate', function(templateId) {
  if(Roles.userIsInRole(this.userId, ['admin'])) {
    return Tournaments.find({_id: templateId, isTemplate: true});
  }
});
