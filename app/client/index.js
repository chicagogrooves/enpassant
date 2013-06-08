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
  // Deps.autorun(function(){
  //   if (Session.get("now-playing-game")) {
  //     var g = Games.findOne( Session.get("now-playing-game") );
  //     if(g)
  //       Session.set("now-playing-board", Board.fromMoves(g.moves) )
  //       //Session.set("now-playing-board", g.moves.length )
  //   }
  // });
});

Template.game.game = function(){
  return Games.findOne( Session.get("now-playing-game") );
}

Template.game.board = function(){
  var game = Games.findOne( Session.get("now-playing-game") );
  var br = new BoardRenderer( Board.fromMoves(game.moves) );
  var html = br.render();
  return html[0].outerHTML;
}

if (Meteor.isClient) {
    Template.game.rendered = function(){
      //Debug.make_test_board();
      
      //what ? just fetch it but return nothing ? 
      //Session.get("now-playing-board")
    };
}

// if( Meteor.isClient) {
//   Meteor.startup( function(){
//     Debug.make_test_board();
//   });
// }

