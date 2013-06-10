Meteor.publish("games", function () {
  //return Games.find();
  
  return Games.find(
    {$or: [
      {blackUserId: this.userId},
      {whiteUserId: this.userId},
      {public: true}
    ]});
});
