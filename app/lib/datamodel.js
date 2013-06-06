Games = new Meteor.Collection("games");
if( Meteor.isServer && Games.find().count()==0 ){
  var games = [
    {name: 'Dean vs Paul'}
  ];
  
  _.each(games, function(g){
    Games.insert(g);
  });
}