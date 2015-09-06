Tournaments = new Mongo.Collection('tournaments');

ParticipantsSchema = new SimpleSchema({
  userId: {
    type: String
  },
  account: {
    type: String
  },
  race: {
    type: String
  },
  checkedIn: {
    type: Boolean
  }
});

ModesSchema = new SimpleSchema({
  ro: {
    type: Number
  },
  bo: {
    type: Number
  }
});

TournamentSchema = new SimpleSchema({
  userId: {
    type: String
  },
  createdAt: {
    type: Date
  },
  status: {
    type: String
  },
  date: {
    type: Date
  },
  region: {
    type: String
  },
  title: {
    type: String,
    max: 200
  },
  category: {
    type: String
  },
  leagues: {
    type: [String]
  },
  description: {
    type: String
  },
  modes: {
    type: [ModesSchema]
  },
  participants: {
    type: [ParticipantsSchema]
  },
  bracket: {
    type: [new SimpleSchema({
      ro: {
        type: Number
      },
      mode: {
        type: Number
      },
      participants: {
        type: [new SimpleSchema({
          userId: {
            type: String
          },
          account: {
            type: String
          },
          race: {
            type: String
          },
          score: {
            type: Number
          }
        })]
      }
    })]
  }
});

Tournaments.attachSchema(TournamentSchema);

Meteor.methods({
  tournamentsCreate: function(options) {
    var user = Meteor.user();
    var userId = user._id;
    var createdAt = new Date();
    var title = options.title;
    var region = options.region;
    var category = options.category;
    var description = options.description;
    var leagues = options.leagues;
    var date = options.date;
    var modes = options.modes;

    if(Roles.userIsInRole(user, ['admin'])) {
      return Tournaments.insert({
        userId: userId,
        createdAt: createdAt,
        status: 'open',
        title: title,
        region: region,
        category: category,
        description: description,
        date: date,
        leagues: leagues,
        modes: modes,
        participants: [],
        bracket: []
      }, function(err, res) {
        if(err) {
          if(Meteor.isServer) {
            throw new Meteor.Error(403, err.message);
          }
        } else {
          return 'kings';
        }
      });
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsUpdate: function(tournamentId, options) {
    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      Tournaments.update({_id: tournamentId}, {$set: options});
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsDelete: function(tournamentId) {
    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      Tournaments.remove({_id: tournamentId});
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsStartCheckin: function(tournamentId) {
    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      var tournament = Tournaments.findOne(tournamentId);
      if(tournament.status === "open") {
        Tournaments.update(tournamentId, {$set: {status: "checkin"}});
      }
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsStart: function(tournamentId) {
    if(Meteor.isServer) {
      var user = Meteor.user();
      if(Roles.userIsInRole(user, ['admin'])) {
        function shuffle(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
        var tournament = Tournaments.findOne(tournamentId);
        var shuffledParticipants = shuffle(tournament.participants);
        if(tournament.status === "checkin") {
          if(shuffledParticipants.length >= 2) {
            var bracketSize = 1;
            while(bracketSize < shuffledParticipants.length) {
              bracketSize *= 2;
            }
            var mode;
            for(var i = 1; i <= bracketSize; i *= 2) {
              mode = tournament.modes[0].bo;
              var participants = [];
              if(i === bracketSize) {
                // if we are at bracket size, fill with participants & BYEs
                var byeCount = bracketSize - shuffledParticipants.length;
                for(var j = 0; j < byeCount*2; j += 2) {
                  participants[j] = {
                    userId: 'BYE',
                    account: 'BYE',
                    race: 'BYE',
                    score: 0
                  }
                }
                var currentSlot = 0;
                for(var l = 0; l < shuffledParticipants.length; l++) {
                  while(participants[currentSlot] != undefined) {
                    currentSlot++;
                  }
                  participants[currentSlot] = {
                    userId: shuffledParticipants[l].userId,
                    account: shuffledParticipants[l].account,
                    race: shuffledParticipants[l].race,
                    score: 0
                  }
                }
              } else {
                // else fill with placeholders
                for(var k = 0; k < i; k++) {
                  participants.push({
                    userId: 'empty',
                    account: 'empty',
                    race: 'empty',
                    score: 0
                  });
                }
              }
              for(var m = 0; m < tournament.modes.length; m++) {
                if(tournament.modes[m].ro === i) {
                  mode = tournament.modes[m].bo;
                }
              }
              var round = {
                ro: i,
                mode: mode,
                participants: participants
              };
              Tournaments.update(tournamentId, {$push: {bracket: round}});
            }
            Tournaments.update(tournamentId, {$set: {status: "running"}});
          } else {
            console.log("need atleast 2 participants")
          }
        }
      } else {
        throw new Meteor.Error(403, 'Access denied');
      }
    }
  },
  tournamentsAddParticipants: function(tournamentId, amount) {
    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      var tournament = Tournaments.findOne(tournamentId);
      var races = ['random', 'protoss', 'terran', 'zerg'];
      var randomRace = 'random';
      if(Meteor.isServer) {
        for(var i = 0; i < amount; i++) {
          randomRace = races[Math.floor(Math.random() * races.length)];
          Tournaments.update(tournamentId, {$push: {participants: {
            userId: Random.id(),
            account: "User#" + i,
            race: randomRace,
            checkedIn: true
          }}});
        }
      }
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsReset: function(tournamentId) {
    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      Tournaments.update(tournamentId, {$set: {
        status: "open",
        participants: [],
        bracket: []
      }});
    } else {
      throw new Meteor.Error(403, 'Access denied');
    }
  },
  tournamentsSignup: function(tournamentId) {
    var user = Meteor.user();
    var tournament = Tournaments.findOne(tournamentId);
    var checkedIn = false;
    if(tournament.status === 'checkin') checkedIn = true;
    if(user) {
      if(tournament.status === 'open' || tournament.status === 'checkin') {
        // check if user is already participating
        for(var i = 0; i < tournament.participants.length; i++) {
          if(tournament.participants[i].userId === user._id) {
            // user already participating
            throw new Meteor.Error(403, 'Already signed up')
          }
        }
        if(user.accounts[tournament.region]) {
          Tournaments.update({_id: tournamentId}, {$push: {participants: {
            userId: user._id,
            account: user.accounts[tournament.region].tag,
            race: user.accounts[tournament.region].race,
            checkedIn: checkedIn
          }}});
        } else {
          // no account found for tournaments region
          throw new Meteor.Error(403, 'Account not set for region');
        }
      } else {
        // sign ups closed
        throw new Meteor.Error(403, 'Signups closed')
      }
    } else {
      // not logged in
      throw new Meteor.Error(403, 'Must be logged in');
    }
  },
  tournamentsSignout: function(tournamentId) {
    var user = Meteor.user();
    var tournament = Tournaments.findOne(tournamentId);
    if(user) {
      if(tournament.status === 'open' || tournament.status === 'checkin') {
        var isParticipant = false;
        for(var i = 0; i < tournament.participants.length; i++) {
          if(tournament.participants[i].userId === user._id) isParticipant = true;
        }
        if(isParticipant) {
          Tournaments.update(tournamentId, {$pull: {participants: {userId: user._id}}});
        } else {
          throw new Meteor.Error(403, 'Must be signed in to sign out duh')
        }
      } else {
        throw new Meteor.Error(403, 'May not sign out during tournament');
      }
    } else {
      throw new Meteor.Error(403, 'Must be logged in');
    }
  }
});
