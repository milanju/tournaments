Template.tournament.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var tournamentId = FlowRouter.getParam('tournamentId');
    self.subscribe('singleTournament', tournamentId);
  });
});

Template.tournament.helpers({
  tournament: function() {
    var tournamentId = FlowRouter.getParam('tournamentId');
    var tournament = Tournaments.findOne({_id: tournamentId});
    return tournament;
  }
});
