var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var account = new Schema({
  facebookId: Number,
  email: String,
  phone: String,
  name: String,
  urlImg: String
});
module.exports = mongoose.model("account", account);
