AccountTagSchema = new SimpleSchema({
  tag: {
    type: String,
    min: 4,
    max: 100
  },
  race: {
    type: String
  }
});

UserSchema = new SimpleSchema({
  username: {
      type: String,
      regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  emails: {
      type: [Object],
      optional: true
  },
  "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
      type: Boolean
  },
  createdAt: {
      type: Date
  },
  services: {
      type: Object,
      optional: true,
      blackbox: true
  },
  roles: {
      type: [String],
      optional: true
  },
  accounts: {
    type: new SimpleSchema({
      eu: {
        type: AccountTagSchema
      },
      na: {
        type: AccountTagSchema
      },
      kr: {
        type: AccountTagSchema
      }
    }),
    optional: true
  }
});

Meteor.users.attachSchema(UserSchema);

Meteor.methods({
  usersSetAccount: function(server, name, race) {
    var user = Meteor.user();
    if(user) {
      if(server === 'eu' || server === 'na' || server === 'kr') {
        if(race === 'random' || race === 'protoss' || race === 'terran' || race === 'zerg') {
          var tagField = 'accounts.' + server + '.tag';
          var raceField = 'accounts.' + server + '.race';
          var obj = {};
          obj[tagField] = name;
          obj[raceField] = race;
          Meteor.users.update({_id: user._id}, {$set: obj});
        }
      }
    }
  }
});
