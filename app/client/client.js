Meteor.subscribe("games");

// If no party selected, select one.
Meteor.startup(function () {
  Deps.autorun(function () {
    if (! Session.get("nowplaying")) {
      var game = Games.findOne();
      if (game)
        Session.set("nowplaying", game._id);
    }
  });
});

if( Meteor.isClient) {
  Meteor.startup( function(){
    Debug.make_test_board();
  });
}
// if (Meteor.isClient) {
//     Template.board.rendered = function(){
//       Debug.make_test_board();
//     };
// }