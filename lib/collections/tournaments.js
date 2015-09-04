/*Tournaments = new Mongo.Collection()

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
        type: String,
        min: 4,
        max: 100,
        optional: true
      },
      na: {
        type: String,
        min: 4,
        max: 100,
        optional: true
      },
      kr: {
        type: String,
        min: 4,
        max: 100,
        optional: true
      }
    }),
    optional: true
  }
});

Meteor.users.attachSchema(UserSchema);*/
