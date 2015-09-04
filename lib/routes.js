Router.route('/', function () {
  this.layout('mainLayout');
  this.render('home');
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
