var prepareEnvironment = function () {
  // wipe db
  Tournaments.remove({});
  Meteor.users.remove({});

  // create admin user
  var adminId = Accounts.createUser({
    username: 'admin',
    password: 'admin'
  });
  Meteor.users.update({_id: adminId}, {$set: {roles: ['admin'], accounts: {
    eu: {
      tag: 'admin#111',
      race: 'protoss'
    },
    na: {
      tag: 'admin#222',
      race: 'terran'
    },
    kr: {
      tag: 'admin#333',
      race: 'zerg'
    }
  }}});

  // create sample tournament
  var date = new Date();
  date.setDate(date.getDate() + 1);

  var tournamentId = Tournaments.insert({
    _id: 'demo',
    isTemplate: false,
    userId: adminId,
    createdAt: new Date(),
    status: 'checkin',
    title: 'Demo Tournament',
    region: 'eu',
    category: 'Demo Tournaments',
    description: 'Welcome to the automatically created demo tournament! Start the tournament to generate the bracket.',
    date: date,
    leagues: ['Bronze', 'Silver', 'Gold'],
    modes: [{ro: 0, bo: 3}],
    participants: [],
    bracket: []
  });

  // populate with dummies
  (function() {
    var tournament = Tournaments.findOne(tournamentId);
    var races = ['random', 'protoss', 'terran', 'zerg'];
    var randomRace = 'random';
    if(Meteor.isServer) {
      for(var i = 0; i < 15; i++) {
        randomRace = races[Math.floor(Math.random() * races.length)];
        Tournaments.update(tournamentId, {$push: {participants: {
          userId: Random.id(),
          account: "User#" + i,
          race: randomRace,
          checkedIn: true
        }}});
      }
    }
  })();
}

Meteor.startup(function () {
  prepareEnvironment();
});

Meteor.setInterval(prepareEnvironment, 3600000);
