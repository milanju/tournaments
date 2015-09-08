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
      return "0";
    }
    for(var i = 0; i < bracketIndex; i++) {
      margin *= 2;
    }
    margin -= 24;
    if(currentBracket.participants.indexOf(this) === 0
      || currentBracket.participants.indexOf(this) === currentBracket.participants.length-1) {
      return margin + "px";
    } else {
      return 2*margin + "px";
    }
  },
  marginBottom: function() {
    return "";
  }
});
