const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { schemaOptions } = require("./modelOptions");

const sectionSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    icon: {
      type: String,
      default: '🟡'
    },
    title: {
      type: String,
      default: "Untitled",
    },
  },
  schemaOptions
);

module.exports = mongoose.model("Section", sectionSchema);
