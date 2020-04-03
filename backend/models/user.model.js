const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  cpf: { type: Number, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  senha: { type: String, required: true, select: false },
}, {
  timestamp: true,
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;

  next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;