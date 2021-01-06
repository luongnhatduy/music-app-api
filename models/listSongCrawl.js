var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listSongCrawl = new Schema({
  name_song: String,
  name_singer: String,
  link: String,
  count_view: Number,
  img: String,
  status : Boolean
});
module.exports = mongoose.model("listSongCrawl", listSongCrawl);
