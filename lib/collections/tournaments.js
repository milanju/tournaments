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
  isTemplate: {
    type: Boolean
  },
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
          _id: {
            type: String
          },
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
            // 'a' === PlayerA win
            // 'b' === PlayerB win
            type: [String]
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
    var isTemplate = options.isTemplate;
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
        isTemplate: isTemplate,
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
              for(var m = 0; m < tournament.modes.length; m++) {
                if(tournament.modes[m].ro === i) {
                  mode = tournament.modes[m].bo;
                }
              }
              var score = [];
              for(var n = 0; n < mode; n++) {
                score.push('empty');
              }
              var participants = [];
              if(i === bracketSize) {
                // if we are at bracket size, fill with participants & BYEs
                var byeCount = bracketSize - shuffledParticipants.length;
                for(var j = 0; j < byeCount*2; j += 2) {
                  participants[j] = {
                    _id: Random.id(),
                    userId: 'BYE',
                    account: 'BYE',
                    race: 'BYE',
                    score: score
                  }
                }
                var currentSlot = 0;
                for(var l = 0; l < shuffledParticipants.length; l++) {
                  while(participants[currentSlot] != undefined) {
                    currentSlot++;
                  }
                  participants[currentSlot] = {
                    _id: Random.id(),
                    userId: shuffledParticipants[l].userId,
                    account: shuffledParticipants[l].account,
                    race: shuffledParticipants[l].race,
                    score: score
                  }
                }
              } else {
                // else fill with placeholders
                for(var k = 0; k < i; k++) {
                  participants.push({
                    _id: Random.id(),
                    userId: 'empty',
                    account: 'empty',
                    race: 'empty',
                    score: score
                  });
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
  },
  tournamentsUpdateScore: function(tournamentId, match, map, result) {
    var user = Meteor.user();
    var tournament = Tournaments.findOne(tournamentId);
    var bracket = tournament.bracket;

    // Check if User is reporting his own match
    if(match.player.userId !== user._id) {
      console.log('Access denied')
      throw new Meteor.Error(500, 'Access denied');
    }

    // Check if match is open
    for(var i = 0; i < bracket.length; i++) {
      for(var j = 0; j < bracket[i].participants.length; j++) {
        if(bracket[i].participants[j]._id === match.player._id) {
          var bracketIndex = i;
          var playerIndex = j;
          var mod = j;
          if(!(j % 2 == 0)) {
            mod++;
            var opponentIndex = j-1;
          } else {
            var opponentIndex = j+1;
          }
          if(bracket[i-1].participants[mod/2].userId !== 'empty') {
            console.log('match not open');
            throw new Meteor.Error(500, 'Match is not open');
          }
        }
      }
    }

    // Update score
    var setScore = {};
    setScore['bracket.' + bracketIndex + '.participants.' + playerIndex + '.score.' + map] = result;
    setScore['bracket.' + bracketIndex + '.participants.' + opponentIndex + '.score.' + map] = result;

    Tournaments.update(tournamentId, {$set: setScore});
  },
  tournamentsSubmitScore: function(tournamentId, scores, userId) {
    function isEven(n) {
      return (n % 2 == 0);
    }

    var user = Meteor.user();
    if(Roles.userIsInRole, ['admin'] && userId) {
      user = {_id: userId};
    }
    var tournament = Tournaments.findOne(tournamentId);

    // find player & opponent in tournament
    var participating = false;
    var mode;
    var ro;
    var bracketIndex;
    var participantsIndex;

    for(var i = 0; i < tournament.bracket.length; i++) {
      for(var j = 0; j < tournament.bracket[i].participants.length; j++) {
        if(tournament.bracket[i].participants[j].userId === user._id) {
          var player = tournament.bracket[i].participants[j];
          if(isEven(j)) {
            var opponent = tournament.bracket[i].participants[j+1];
            opponentIndex = j + 1;
          } else {
            var opponent = tournament.bracket[i].participants[j-1];
            opponentIndex = j - 1;
          }
          mode = tournament.bracket[i].mode;
          ro = tournament.bracket[i].ro;
          bracketIndex = i;
          playerIndex = j;
          participating = true;
        }
      }
      if(participating === true) break;
    }

    if(opponent.userId === "empty" || opponent.userId === "BYE") {
      throw new Meteor.Error(403, 'May only report score when facing opponent');
    }

    if(participating) {
      if(player.score === 0 && opponent.score === 0) {
        if(scores.length === mode) {
          var playerScore = 0;
          var opponentScore = 0;
          var expectedScore = ((mode - 1) / 2) + 1;
          for(var i = 0; i < scores.length; i++) {
            if(scores[i] === 'win') playerScore++;
            if(scores[i] === 'lose') opponentScore++;
          }
          if(playerScore !== expectedScore && opponentScore !== expectedScore) {
            throw new Meteor.Error(403, 'Invalid score submission');
          } else {
            // All good, set scores
            var incScores = {};
            incScores['bracket.' + bracketIndex + '.participants.' + playerIndex + '.score'] = playerScore;
            incScores['bracket.' + bracketIndex + '.participants.' + opponentIndex + '.score'] = opponentScore;

            Tournaments.update(tournamentId, {$inc: incScores});
            var setWinner = {};
            // advance winner

            if(playerScore === ((mode - 1) / 2) + 1) {
              var winner = player;
              var winnerIndex = playerIndex;
            } else {
              var winner = opponent;
              var winnerIndex = opponentIndex;
            }

            if(isEven(winnerIndex)) {
              var advancedIndex = winnerIndex / 2;
            } else {
              var advancedIndex = (winnerIndex - 1) / 2;
            }
            winner._id = Random.id();
            winner.score = 0;
            var advancedBracketIndex = bracketIndex - 1;
            setWinner['bracket.' + advancedBracketIndex + '.participants.' + advancedIndex] = winner;

            Tournaments.update(tournamentId, {$set: setWinner});


          }
        } else {
          throw new Meteor.Error(403, 'Invalid scores array')
        }
      } else {
        throw new Meteor.Error(403, 'Score already reported');
      }
    } else {
      throw new Meteor.Error(403, 'Not participating');
    }
  },
  tournamentsSetPlayerBack: function(tournamentId, match) {
    function mostRight() {
      for(var i = 0; i < tournament.bracket.length; i++) {
        for(var j = 0; j < tournament.bracket[i].participants.length; j++) {
          if(tournament.bracket[i].participants[j].userId === match.userId) {
            if(tournament.bracket[i].participants[j]._id === match._id) {
              bracketIndex = i;
              playerIndex = j;
              return true;
            } else {
              return false;
            }
          }
        }
      }
      return false;
    }

    function mostLeft() {
      var i = tournament.bracket.length-1;
      for(var j = 0; j < tournament.bracket[i].participants.length; j++) {
        if(tournament.bracket[i].participants[j]._id === match._id) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }

    var user = Meteor.user();
    if(Roles.userIsInRole(user, ['admin'])) {
      var tournament = Tournaments.findOne(tournamentId);
      var bracketIndex;
      var playerIndex;
      var newPlayerIndex;
      if(mostRight()) {
        if(!mostLeft()) {
          // All check, set back player now
          var set = {};
          set['bracket.' + (bracketIndex+1) + '.participants.' + (playerIndex*2) + '.score'] = 0;
          set['bracket.' + (bracketIndex+1) + '.participants.' + ((playerIndex*2)+1) + '.score'] = 0;
          set['bracket.' + bracketIndex + '.participants.' + playerIndex + '.score'] = 0;
          set['bracket.' + bracketIndex + '.participants.' + playerIndex + '.userId'] = 'empty';
          set['bracket.' + bracketIndex + '.participants.' + playerIndex + '.account'] = 'empty';
          set['bracket.' + bracketIndex + '.participants.' + playerIndex + '.race'] = 'empty';
          Tournaments.update(tournamentId, {$set: set})
        } else {
          throw new Meteor.Error('Cannot set back user in first round');
        }
      } else {
        throw new Meteor.Error('May only set back furthest instance of user');
      }
    } else {
      throw new Meteor.Error('Access denied');
    }
  }
});
