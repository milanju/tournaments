FlowRouter.route('/', {
  name: 'home',
  action: function () {
    BlazeLayout.render('mainLayout', {main: 'home'});
  }
});

FlowRouter.route('/register', {
  name: 'register',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'register'});
  }
});

FlowRouter.route('/admin', {
  name: 'adminHome',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'adminHome'});
  }
});

FlowRouter.route('/admin/users', {
  name: 'adminUsers',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'adminUsers'});
  }
});

FlowRouter.route('/admin/templates', {
  name: 'adminTemplates',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'adminTemplates'});
  }
});

FlowRouter.route('/admin/templates/new', {
  name: 'adminTemplatesNew',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'adminTemplatesNew'});
  }
});

FlowRouter.route('/admin/templates/:_id/edit', {
  name: 'adminTemplatesEdit',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'adminTemplatesEdit'});
  }
});

FlowRouter.route('/users/:username', {
  name: 'userProfile',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'userProfile'});
  }
});

FlowRouter.route('/users/:username/edit', {
  name: 'userProfileEdit',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'userProfileEdit'});
  }
});

FlowRouter.route('/t/new', {
  name: 'tournamentNew',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'tournamentNew'});
  }
});

FlowRouter.route('/t/:tournamentId', {
  name: 'tournament',
  action: function() {
    BlazeLayout.render('mainLayout', {main: 'tournament'});
  }
});

FlowRouter.triggers.exit(function() {
  $('.content').velocity('stop');
  $('footer').velocity('stop');
  $('.content').css('opacity', '1');
  $('footer').css('display', 'none');
});
FlowRouter.triggers.enter(function() {
  $('.content').velocity('transition.fadeIn', {duration: 500});
  $('footer').velocity('transition.fadeIn', {duration: 500});
})
