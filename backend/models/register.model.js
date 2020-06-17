const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisterSchema = new Schema({
  occupied_table: String,
  client_name: String,
  occupation_time: Date,
  vacancy_time: Date
});

const Register = mongoose.model('Register', RegisterSchema);
module.exports = Register;
