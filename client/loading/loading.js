Template.loading.onRendered(function() {
  NProgress.configure({ parent: '.main-card' });
  NProgress.start();
});

Template.loading.onDestroyed(function() {
  NProgress.done();
});
