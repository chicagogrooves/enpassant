// require 'test_data'

Games = new Meteor.Collection("games");

Collections = {
  games: Games
};

SeedUserIds = {}; //map of username to id

if( Meteor.isServer){
  
  Accounts.onCreateUser(function(options, user) {
    SeedUserIds[user.username] = user._id;
    return user;
  });
  
  if( Meteor.users.find().count()==0) {
    _(TestData.users).each( function(u){
      Accounts.createUser(u);
    });
  }
  
  //load up seeds from TestData
  if( Games.find().count()==0){
    _(['games']).each( function(entity){
      var data = TestData[entity];
      var coll = Collections[entity];
    
      if( Games.find().count()==0 ){
        _.each(TestData.games, function(g){
          g.whiteUserId = SeedUserIds[g.whiteUserName];
          g.blackUserId = SeedUserIds[g.blackUserName];
          Games.insert(g);
        });
      }
    });
  }
}

Games.allow({
  update: function (userId, docs, fields, modifier) {
    return !!(modifier.$push) 
  }
})