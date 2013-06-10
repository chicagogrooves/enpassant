Meteor.subscribe("games");

Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("now-playing-game")) {
      var game = Games.findOne();
      if (game)
        Session.set("now-playing-game", game._id);
    }
  });
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
    };
}

