var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var comment = new Schema({
  accountId: String,
  songId: String,
  text: String,
  createdAt: Date,
});
module.exports = mongoose.model("comment", comment);
