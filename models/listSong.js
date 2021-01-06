var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listSong = new Schema({
  name_song: String,
  name_singer: String,
  link: String,
  count_view: Number,
  img: String,
  type : String,
  status : Boolean
});
module.exports = mongoose.model("listsong", listSong);
