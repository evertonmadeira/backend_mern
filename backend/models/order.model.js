const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  mesa: Number,
  status: String,
  pedidos: [{
    quantity: Number,
    nome: String,
    preco: Number,
  }],
  total: Number,
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
