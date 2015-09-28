Template.adminTemplates.helpers({
  templates: function() {
    return Tournaments.find({isTemplate: true});
  }
});
