Template.registerHelper('formatDate', function(date, format) {
  return moment(date).format(format);
});

Template.registerHelper('isReady', function(sub) {
  if(sub) {
    return FlowRouter.subsReady(sub);
  } else {
    return FlowRouter.subsReady();
  }
});
