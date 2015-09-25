Template.adminNav.helpers({
  active: function(route) {
    if(route === Router.current().route.getName()) return 'active';
  }
});
