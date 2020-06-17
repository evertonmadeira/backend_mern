const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  categoria: { type: String, required: true },
  preco: { type: Number, required: true },
  quantity: { type: Number },
  img: {
    name: String,
    size: Number,
    key: String,
    url: String,
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
