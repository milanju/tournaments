Template.home.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('tournaments');
  });
});

Template.home.helpers({
  tournaments: function() {
    return Tournaments.find();
  }
})

Template.home.events({
  'mouseenter .tournament-list-row': function() {
    $('.info-' + this._id).addClass('tournament-list-info-content-toggle');
  },
  'mouseleave .tournament-list-row': function() {
    $('.info-' + this._id).removeClass('tournament-list-info-content-toggle');
  },
  'click .tournament-list-row': function() {
    FlowRouter.go('/t/' + this._id);
  }
});
