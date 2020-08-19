const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const TableSchema = new Schema({
  num: Number,
  estado: String,
  register_id: { type: Schema.Types.ObjectId, ref: 'Register' },
  registered_client: String,
  registered_time: Date,
  is_paid: { type: Boolean, default: false },
  flag_to_vacancy: { type: Boolean, default: false },
  total: Number
});


const Table = mongoose.model('Table', TableSchema);
module.exports = Table;