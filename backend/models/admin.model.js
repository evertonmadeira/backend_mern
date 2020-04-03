const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema

const AdminSchema = new Schema({
  name: { type: String, required: true },
  adminEmail: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true, select: false },
}, {
  timestamp: true,
})

AdminSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
})

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin;