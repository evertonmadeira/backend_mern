const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  nome: { type: String, required: true },
  img: {
    name: String,
    size: Number,
    key: String,
    url: String,
  }
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
