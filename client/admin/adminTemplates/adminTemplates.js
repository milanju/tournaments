Template.adminTemplates.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('templates');
  });
});

Template.adminTemplates.helpers({
  templates: function() {
    return Tournaments.find({isTemplate: true});
  }
});
