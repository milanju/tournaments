getMatch = function(bracket) {
  function isEven (n) {
    return (n % 2) === 0;
  }
  console.log("BRACKET: ");
  console.log(bracket);
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
  console.log({player: player, opponent: opponent, mode: mode});
  return {player: player, opponent: opponent, mode: mode};
}

Template.tournamentUsercpReport.onCreated(function() {
  this.scores = new ReactiveVar([]);
  var match = getMatch(this.data.bracket);
  for(var i = 0; i < match.mode; i++) {
    var array = this.scores.get();
    array.push('empty');
    this.scores.set(array);
  }
});

Template.tournamentUsercpReport.helpers({
  match: function() {
    return getMatch(this.bracket);
  },
  loopCount: function(n) {
    var countArray = [];
    for(var i = 0; i < n; i++) {
      countArray.push(i);
    }
    return countArray;
  },
  selected: function(status) {
    var scores = Template.instance().scores.get();
    if(scores[this] === status) {
      return 'btn-primary';
    } else {
      return 'btn-default';
    }
  }
});

Template.tournamentUsercpReport.events({
  'click #submit-score': function(event, template) {
    var scores = template.scores.get();
    var tournamentId = Template.currentData()._id;

    Meteor.call('tournamentsSubmitScore', tournamentId, scores);
  },
  'click #submit-score-radios button': function(event, template) {
    var result = event.target.id.split('-')[2];
    var scores = template.scores.get();
    scores[this] = result;
    template.scores.set(scores);
  }
});
