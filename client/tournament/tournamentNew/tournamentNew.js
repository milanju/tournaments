Template.tournamentNew.onCreated(function() {
  this.modes = new ReactiveVar([]);
});

Template.tournamentNew.onRendered(function() {
    this.$('#new-tournament-date').datetimepicker({
      format: 'LLL'
    });
});

Template.tournamentNew.helpers({
  modes: function() {
    return Template.instance().modes.get();
  }
});

Template.tournamentNew.events({
  'submit #new-tournament-form': function(event) {
    console.log('submitting');
    var region = event.target['new-tournament-region'].value.toLowerCase();
    var title = event.target['new-tournament-title'].value;
    var category = event.target['new-tournament-category'].value;
    var description = event.target['new-tournament-description'].value;
    var leagues = [event.target['new-tournament-leagues'].value];
    var date = new Date(event.target['new-tournament-date'].value);
    var modeInputs = $('.new-tournament-mode-custom');
    var defaultMode = event.target['new-tournament-mode-default'].value;
    var modes = [];
    var ro = 2;
    modes.push({ro: 0, bo: parseInt(defaultMode)});
    for(var i = 0; i < modeInputs.length; i++) {
      modes.push({ro: ro, bo: parseInt(modeInputs[i].value)});
      ro *= 2;
    }
    console.log(modes);

    Meteor.call('tournamentsCreate', {
      region: region,
      title: title,
      category: category,
      description: description,
      leagues: leagues,
      date: date,
      modes: modes
    }, function(err, res) {
      if(err) {
        $('.new-tournament-form-error').html(err.reason).show();
      } else {
        Router.go('/t/' + res);
      }
    });

    return false;
  },
  'click #new-tournament-mode-add': function(event, template) {
    var modes = template.modes.get();
    if(modes.length === 0) {
      modes.push(2);
    } else {
      modes.push(modes[modes.length-1] * 2);
    }
    template.modes.set(modes);
  },
  'click #new-tournament-mode-remove': function(event, template) {
    var modes = template.modes.get();
    modes.pop();
    template.modes.set(modes);
  }
});
