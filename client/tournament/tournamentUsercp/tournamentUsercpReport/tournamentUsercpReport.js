getMatch = function(bracket) {
  var user = Meteor.user();
  var foundPlayer = false;
  for(var i = 0; i < bracket.length; i++) {
    for(var j = 0; j < bracket[i].participants.length; j++) {
      if(bracket[i].participants[j].userId === user._id) {
        var player = bracket[i].participants[j];
        var mode = bracket[i].mode;
        if(isEven(j)) {
          var opponent = bracket[i].participants[j+1];
        } else {
          var opponent = bracket[i].participants[j-1];
        }
        foundPlayer = true;
        break;
      }
      if(foundPlayer) break;
    }
  }
  return {player: player, opponent: opponent, mode: mode};
}

Template.tournamentUsercpReport.onCreated(function() {
  var instance = this;
  instance.tournament = function() {
    return Tournaments.findOne(this.data.tournamentId);
  }
});

Template.tournamentUsercpReport.helpers({
  tournament: function() {
    return Template.instance().tournament();
  },
  inc: function(i) {
    return i+1;
  },
  match: function() {
    var tournament = Template.instance().tournament();
    return getMatch(tournament.bracket);
  },
  loopCount: function(n) {
    var countArray = [];
    for(var i = 0; i < n; i++) {
      countArray.push(i);
    }
    return countArray;
  },
  selected: function(status) {
    var match = getMatch(Template.instance().tournament().bracket);
    console.log(match);
    var scores = match.player.score;
    if(scores[this] === status) {
      return 'btn-primary';
    } else {
      return 'btn-flat';
    }
  }
});

Template.tournamentUsercpReport.events({
  'click #submit-score': function(event, template) {
    var scores = template.scores.get();
    var tournamentId = Template.currentData()._id;
    Meteor.call('tournamentsSubmitScore', tournamentId, scores);
  },
  /*'click #submit-score-radios button': function(event, template) {
    var result = event.target.id.split('-')[2];
    var scores = template.scores.get();
    scores[this] = result;
    template.scores.set(scores);
  },*/
  'click .btn-submit-score': function(event, template) {
    var tournament = Template.instance().tournament();
    var match = getMatch(tournament.bracket);
    var map = parseInt(this);
    var result = event.target.getAttribute('data');
    Meteor.call('tournamentsUpdateScore', tournament._id, match, map, result);
  }
});
