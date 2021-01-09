var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var category = new Schema({
  name: String,
  bgColor: String
});
module.exports = mongoose.model("category", category);
