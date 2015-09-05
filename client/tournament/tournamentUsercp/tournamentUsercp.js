Template.tournamentUsercp.helpers({
  isParticipant: function() {
    var user = Meteor.user();
    var participants = this.participants;
    for(var i = 0; i < participants.length; i++) {
      if(participants[i].userId === user._id) return true;
    }
    return false;
  },
  signupsOpen: function() {
    var status = this.status;
    if(status === "open" || status === "checkin") return true;
    return false;
  },
  account: function() {
    var user = Meteor.user();
    var region = this.region;
    return user.accounts[region].tag;
  }
});

Template.tournamentUsercp.events({
  'click #tournament-usercp-signup': function() {
    Meteor.call('tournamentsSignup', this._id);
  },
  'click #tournament-usercp-signout': function() {
    Meteor.call('tournamentsSignout', this._id);
  }
});
