Template.adminTemplatesEdit.helpers({
  template: function() {
    var templateId = Iron.controller().getParams()._id;
    return Tournaments.findOne({_id: templateId, isTemplate: true});
  }
});
