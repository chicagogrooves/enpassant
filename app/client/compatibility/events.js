/* begin a little bit of js hackery */
function submitNewMove(){
  var g = Games.findOne( Session.get("now-playing-game") );
  var newmove = {
    from: $("#new-move-from").val(),
    to: $("#new-move-to").val(),
    notation: $("#new-move-notation").val()
  }
  Games.update( g._id, {$push: {moves: newmove}});
  return false;
}
/* end a little bit of js hackery */
