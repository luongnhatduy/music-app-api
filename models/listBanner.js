var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listBanner = new Schema({
  img : String
});
module.exports = mongoose.model("listBanner", listBanner);
