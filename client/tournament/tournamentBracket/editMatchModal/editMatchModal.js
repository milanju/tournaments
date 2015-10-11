Template.editMatchModal.onCreated(function() {
  delete Session.keys['edit-match'];
});

Template.editMatchModal.helpers({
  match: function() {
    if(Session.get('edit-match')) {
      var firstPlayerId = Session.get('edit-match');
      var tournament = Tournaments.findOne();
      var bracket = tournament.bracket;
      var foundPlayer = false;
      for(var i = 0; i < bracket.length; i++) {
        for(var j = 0; j < bracket[i].participants.length; j++) {
          if(bracket[i].participants[j]._id === firstPlayerId) {
            var firstPlayer = bracket[i].participants[j];
            var secondPlayer = bracket[i].participants[j+1];
            var mode = bracket[i].mode;
            foundPlayer = true;
            break;
          }
          if(foundPlayer) break;
        }
      }
      if(firstPlayer && secondPlayer) {
        return {
          firstPlayer: firstPlayer,
          secondPlayer: secondPlayer,
          mode: mode
        }
      } else {
        throw new Meteor.Error(500, 'Match not found');
      }
    }
  },
  rounds: function(mode) {
    var rounds = [];
    for(var i = 0; i < mode; i++) {
      rounds.push(i);
    }
    return rounds;
  },
  inc: function(i) {
    return i+1;
  },
  selected: function(word) {
    return '';
  }
});
