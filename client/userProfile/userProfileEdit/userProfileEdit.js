Template.userProfileEdit.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var username = FlowRouter.getParam('username');
    self.subscribe('singleUser', username);
  });
})

Template.userProfileEdit.helpers({
  isCurrentUser: function() {
    if(Meteor.user()) {
      var routeUsername = FlowRouter.getParam('username');
      var currentUsername = Meteor.user().username;
      if(routeUsername === currentUsername) {
        return true;
      } else {
        return false;
      }
    }
  },
  selectedRace: function(region, race) {
    if(Meteor.user().accounts[region]) {
      if(Meteor.user().accounts[region].race === race) return 'selected';
    }
    return;
  }
});

Template.userProfileEdit.events({
  'submit #profile-edit-form': function(event) {
    var euTag = event.target['profile-edit-accounts-eu'].value;
    var euRace = event.target['profile-edit-accounts-eu-race'].value.toLowerCase();
    var naTag = event.target['profile-edit-accounts-na'].value;
    var naRace = event.target['profile-edit-accounts-na-race'].value.toLowerCase();
    var krTag = event.target['profile-edit-accounts-kr'].value;
    var krRace = event.target['profile-edit-accounts-kr-race'].value.toLowerCase();
    var username = Meteor.user().username;

    if(euTag !== '') {
      Meteor.call('usersSetAccount', 'eu', euTag, euRace);
    }
    if(naTag !== '') {
      Meteor.call('usersSetAccount', 'na', naTag, naRace);
    }
    if(krTag !== '') {
      Meteor.call('usersSetAccount', 'kr', krTag, krRace);
    }

    FlowRouter.go('/users/' + username);
    return false;
  }
});
