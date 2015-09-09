Template.tournamentBracket.onCreated(function() {
  this.editing = new ReactiveVar({});
});

Template.tournamentBracket.helpers({
  bracket: function() {
    function compare(a, b) {
      if(a.ro > b.ro)
        return -1;
      if(a.ro < b.ro)
        return 1;
      return 0;
    }
    return this.bracket.sort(compare);
  },
  isEven: function() {
    if(Template.parentData().participants.indexOf(this) % 2 === 0) return true;
    return false;
  },
  isParticipant: function() {
    if(this.userId === "empty") return false;
    return true;
  },
  raceBackground: function() {
    return 'match-player-' + this.race;
  },
  margin: function() {
    var bracket = Template.parentData(2).bracket;
    var currentBracket = Template.parentData()
    var bracketIndex = bracket.indexOf(currentBracket);
    var margin = 36;
    if(bracketIndex === bracket.length-1) {
      // winner
      return '0';
    }
    for(var i = 0; i < bracketIndex; i++) {
      margin *= 2;
    }
    margin -= 24;
    if(currentBracket.participants.indexOf(this) === 0
      || currentBracket.participants.indexOf(this) === currentBracket.participants.length-1) {
      return margin + 'px';
    } else {
      return 2*margin + 'px';
    }
  },
  lineHeight: function() {
    var bracket = Template.parentData(2).bracket;
    var currentBracket = Template.parentData();
    var bracketIndex = bracket.indexOf(currentBracket);
    var margin = 36;

    if(currentBracket.ro === 2) {
      return '1px';
    }

    if(currentBracket.ro === 1) {
      return '0; border: 0';
    }

    for(var i = 0; i < bracketIndex; i++) {
      margin *= 2;
    }

    margin -= 24;
    return margin + 'px';
  },
  rightTopLineAdjust: function() {
    var bracket = Template.parentData(2).bracket;
    var currentBracket = Template.parentData();

    if(bracket.indexOf(currentBracket) === 0) {
      return 'display: none;';
    }

    if(currentBracket.ro === 1) {
      return 'border-left: 0;';
    }
  },
  rightBottomLineAdjust: function() {
    var bracket = Template.parentData(2).bracket;
    var currentBracket = Template.parentData();

    if(bracket.indexOf(currentBracket) === 0) {
      return 'display: none;';
    }

    if(currentBracket.ro === 1) {
      return 'display: none;';
    }
  },
  marginBottom: function() {
    return "";
  },
  isFourth: function() {
    return Template.parentData().participants.indexOf(this) % 4 === 0
  },
  beingEdited: function() {
    var editing = Template.instance().editing.get();
    if(editing[this._id]) return true;
    return false;
  }
});

Template.tournamentBracket.events({
  'click .edit-match': function(event, template) {
    var editing = template.editing.get();
    var tournament = Template.currentData();
    var bracket = tournament.bracket;
    var playerA = this._id;
    var playerB;
    var mode;
    for(var i = 0; i < bracket.length; i++) {
      for(var j = 0; j < bracket[i].participants.length; j++) {
        if(bracket[i].participants[j]._id === playerA) {
          playerB = bracket[i].participants[j+1]._id;
          mode = bracket[i].mode;
          break;
        }
      }
    }
    if(editing[playerA] && editing[playerB]) {
      if($('#edit-score-' + playerA)[0] && $('#edit-score-' + playerB)[0]) {
        var scorePlayerA = parseInt($('#edit-score-' + playerA)[0].value);
        var scorePlayerB = parseInt($('#edit-score-' + playerB)[0].value);
        var leftovers = mode - scorePlayerA - scorePlayerB;
        var scores = [];
        for(var i = 0; i < scorePlayerA; i++) {
          scores.push('win');
        }

        for(var i = 0; i < scorePlayerB; i++) {
          scores.push('lose');
        }

        for(var i = 0; i < leftovers; i++) {
          scores.push('empty');
        }

        if(scorePlayerA === ((mode+1)/2) || scorePlayerB === ((mode+1)/2)) {
          Meteor.call('tournamentsSubmitScore', tournament._id, scores, this.userId);
        } else {
          // handle invalid scores
        }    
      }

      delete editing[playerA];
      delete editing[playerB];
    } else {
      editing[playerA] = true;
      editing[playerB] = true;
    }

    template.editing.set(editing);
  }
});
