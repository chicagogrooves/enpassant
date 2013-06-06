Games = new Meteor.Collection("games");
if( Meteor.isServer && Games.find().count()==0 ){
  var games = [
    {
      name: 'Dean vs Paul',
      moves: [
        {from: 'e2', to: 'e4', notation: 'e4'},
        {from: 'e7', to: 'e5', notation: 'e5'}
      ]
    }
  ];
  
  _.each(games, function(g){
    Games.insert(g);
  });
}