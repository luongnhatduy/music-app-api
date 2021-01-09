var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var favoriteSong = new Schema({
  accountId: String,
  songId: String,
  imgSong: String,
  nameSong: String,
  nameArtist: String,
  url: String
});
module.exports = mongoose.model("favoriteSong", favoriteSong);
