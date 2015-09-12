Template.tournament.helpers({
  tournament: function() {
    var tournamentId = Iron.controller().getParams()._id;
    var tournament = Tournaments.findOne({_id: tournamentId});
    return tournament;
  }
});
