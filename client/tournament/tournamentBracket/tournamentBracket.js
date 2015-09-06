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
  }
});
