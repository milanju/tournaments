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
  }
});
