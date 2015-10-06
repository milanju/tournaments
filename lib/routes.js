Router.route('/', {
  layoutTemplate: 'mainLayout',
  subscriptions: function() {
    this.subscribe('tournaments');
  },
  action: function () {
    this.render('home');
  }
});

Router.route('/register', function () {
  this.layout('mainLayout');
  this.render('register');
});

Router.route('/admin', function() {
  this.layout('mainLayout');
  this.render('adminHome');
});

Router.route('/admin/users', function() {
  this.layout('mainLayout');
  this.render('adminUsers');
});

Router.route('/admin/templates', {
  layoutTemplate: 'mainLayout',
  subscriptions: function() {
    this.subscribe('templates');
  },
  action: function() {
    this.render('adminTemplates');
  }
});

Router.route('/admin/templates/new', function() {
  this.layout('mainLayout');
  this.render('adminTemplatesNew');
});

Router.route('/admin/templates/:_id/edit', {
  layoutTemplate: 'mainLayout',
  subscriptions: function() {
    this.subscribe('singleTemplate', this.params._id);
  },
  action: function() {
    this.render('adminTemplatesEdit');
  }
});

Router.route('/users/:username', {
  layoutTemplate: 'mainLayout',
  subscriptions: function() {
    this.subscribe('singleUser', this.params.username);
  },
  action: function() {
    this.render('userProfile');
  }
});

Router.route('/users/:username/edit', {
  layoutTemplate: 'mainLayout',
  action: function() {
    this.render('userProfileEdit');
  }
});

Router.route('/t/new', {
  layoutTemplate: 'mainLayout',
  action: function() {
    this.render('tournamentNew');
  }
});

Router.route('/t/:_id', {
  layoutTemplate: 'mainLayout',
  subscriptions: function() {
    this.subscribe('singleTournament', this.params._id);
  },
  action: function() {
    this.render('tournament');
    if(!this.ready()) {
      this.render('loading');
    }
  }
});

Iron.Router.hooks.fadeOutHook = function() {
  $('.content').css('display', 'none');
  $('footer').css('display', 'none');
  this.next();
}

Router.onBeforeAction('fadeOutHook');

Iron.Router.hooks.fadeInHook = function() {
  $('.content').velocity('transition.fadeIn', 500);
  $('footer').velocity('transition.fadeIn', 500);
}

Router.onAfterAction('fadeInHook');
