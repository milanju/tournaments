Template.tournamentAdmincp.helpers({
  checkInStarted: function() {
    if(this.status === "checkin") return true;
    return false;
  }
});

Template.tournamentAdmincp.events({
  'submit #add-participants-form': function(event) {
    var tournamentId = this._id;
    var amount = event.target['add-participants-amount'].value;

    if(isNaN(amount)) {
      return false;
    }

    amount = parseInt(amount);
    Meteor.call('tournamentsAddParticipants', tournamentId, amount);
    event.target['add-participants-amount'].value = "";
    return false;
  },
  'click #reset-tournament-btn': function() {
    Meteor.call('tournamentsReset', this._id);
  },
  'click #start-checkin-btn': function() {
    Meteor.call('tournamentsStartCheckin', this._id);
  },
  'click #start-tournament-btn': function() {
    Meteor.call('tournamentsStart', this._id);
  }
});
