const mongoose = require("mongoose");
const SubCategory = require("./SubCategory");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subCategory: [
    {
      type: Schema.Types.ObjectId,
      ref: "subcategory",
    },
  ],
});


module.exports = mongoose.model("Category", categorySchema);
