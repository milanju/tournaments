Template.tournament.helpers({
  tournament: function() {
    var tournamentId = Iron.controller().getParams()._id;
    return Tournaments.findOne({_id: tournamentId});
  }
});
