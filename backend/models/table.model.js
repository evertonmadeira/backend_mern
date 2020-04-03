const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  num:  Number,
  estado: String,
  qrcode: String,
},{
  timestamp: true,
});

const Table = mongoose.model('Table', TableSchema);
module.exports = Table;