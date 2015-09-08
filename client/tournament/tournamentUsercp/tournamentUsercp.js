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
  hasOpenMatch: function() {
    function isEven (n) {
      return (n % 2) === 0;
    }
    var user = Meteor.user();
    var bracket = this.bracket;
    for(var i = 0; i < bracket.length; i++) {
      for(var j = 0; j < bracket[i].participants.length; j++) {
        if(bracket[i].participants[j].userId === user._id) {
          var player = bracket[i].participants[j];
          if(isEven(j)) {
            var opponent = bracket[i].participants[j+1];
          } else {
            var opponent = bracket[i].participants[j-1];
          }
          if(opponent.userId !== "empty" && opponent.userId !== "BYE") {
            if(player.score === 0 && opponent.score === 0) {
              console.log('has open match');
              return true;
            }
          }
        }
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
  },
  match: function() {
    return getMatch(this.bracket);
  },
  droppedOut: function() {
    var bracket = Tournaments.findOne().bracket;
    var match = getMatch(bracket);
    if(match.opponent.userId === "empty" || match.opponent.userId === "BYE") {
      return false;
    } else {
      return true;
    }
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
