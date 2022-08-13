const mongoose = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true, select: false },
  },
  schemaOptions
);

module.exports = mongoose.model("User", userSchema);
