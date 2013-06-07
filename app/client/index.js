Meteor.subscribe("games");

// If no party selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("now-playing-game")) {
      var game = Games.findOne();
      if (game)
        Session.set("now-playing-game", game._id);
    }
  });
  Deps.autorun(function(){
    if (Session.get("now-playing-game")) {
      var g = Games.findOne( Session.get("now-playing-game") );
      if(g)
        Session.set("now-playing-board", g.moves.length )
    }
  });
});

Template.game.game = function(){
  return Games.findOne( Session.get("now-playing-game") );
}
Template.game.board = function(){
  return Session.get("now-playing-board");
}

if (Meteor.isClient) {
    Template.game.rendered = function(){
      //Debug.make_test_board();
      Session.get("now-playing-board")
    };
}

// if( Meteor.isClient) {
//   Meteor.startup( function(){
//     Debug.make_test_board();
//   });
// }

