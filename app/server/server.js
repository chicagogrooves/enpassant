Meteor.publish("games", function () {
  return Games.find();
//    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});
