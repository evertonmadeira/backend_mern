const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const autoIncrement = require("mongoose-auto-increment")

const OrderSchema = new Schema({
  mesa: Number,
  status: String,
  pedidos: [
    {
      quantity: Number,
      nome: String,
      preco: Number,
    }
  ],
  order_number: Number,
  subtotal: Number,
}, {
  timestamps: true,
});

// OrderSchema.plugin(autoIncrement.plugin, {
//   model: 'Order',
//   field: 'order_number',
//   startAt: 1
// });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
