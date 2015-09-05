Template.tournamentNew.events({
  'submit #new-tournament-form': function(event) {
    var region = event.target['new-tournament-region'].value.toLowerCase();
    var title = event.target['new-tournament-title'].value;
    var category = event.target['new-tournament-category'].value;
    var description = event.target['new-tournament-description'].value;
    var leagues = [event.target['new-tournament-leagues'].value];
    var date = new Date();

    Meteor.call('tournamentsCreate', {
      region: region,
      title: title,
      category: category,
      description: description,
      leagues: leagues,
      date: date
    }, function(err, res) {
      if(err) {
        $('.new-tournament-form-error').html(err.reason).show();
      } else {
        Router.go('/t/' + res);
      }
    });

    return false;
  }
});
