Template.tournamentUsercp.helpers({
  isParticipant: function() {
    var user = Meteor.user();
    var participants = this.participants;
    for(var i = 0; i < participants.length; i++) {
      if(participants[i].userId === user._id) return true;
    }
    return false;
  },
  isParticipating: function() {
    var user = Meteor.user();
    var bracket = this.bracket;
    for(var i = 0; i < bracket.length; i++) {
      for(var j = 0; j < bracket[i].participants.length; j++) {
        if(bracket[i].participants[j].userId === user._id) return true;
      }
    }
    return false;
  },
  signupsOpen: function() {
    var status = this.status;
    if(status === "open" || status === "checkin") return true;
    return false;
  },
  statusCheckin: function() {
    if(this.status === "checkin") return true;
    return false;
  },
  checkin: function() {
    var user = Meteor.user();
    for(var i = 0; i < this.participants.length; i++) {
      if(this.participants[i].userId === user._id) {
        if(this.participants[i].checkedIn) return false;
      }
    }
    if(this.status === "checkin") return true;
    return false;
  },
  running: function() {
    if(this.status === "running") return true;
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
