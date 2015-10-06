Template.adminNav.helpers({
  active: function(route) {
    if(route === FlowRouter.getRouteName()) return 'active';
  }
});
