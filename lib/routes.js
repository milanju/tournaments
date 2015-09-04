Router.route('/', function () {
  this.layout('mainLayout');
  this.render('home');
});

Router.route('/register', function () {
  this.layout('mainLayout');
  this.render('register');
});
