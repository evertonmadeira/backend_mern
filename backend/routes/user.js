const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

let User = require("../models/user.model");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  })
}

//Requisições ao DB
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/register').post(async (req, res) => {

  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ Error: ' Usuário já existe!' });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user, token: generateToken({ id: user.id }) });

  } catch (err) {
    return res.status(400).send({ Error: 'Problemas no registro.' });
  }


});

router.route('/authenticate').post(async (req, res) => {
  const { email, senha } = req.body;

  const user = await User.findOne({ email }).select('+senha');

  if (!user)
    return res.status(400).send({ Error: 'Usuário não encontrado' });

  if (!await bcrypt.compare(senha, user.senha))
    return res.status(400).send({ Error: 'Senha incorreta' });

  user.password = undefined;

  return res.send({ user, token: generateToken({ id: user.id }) });

})

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/delete/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('Usuário removido!'))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.nome = req.body.nome;
      user.sobrenome = req.body.sobrenome;
      user.cpf = Number(req.body.cpf);
      user.email = req.body.email;
      user.senha = req.body.senha;

      user.save()
        .then(() => res.json('Usuário alterado com sucesso!'))
        .catch((err) => res.status(400).json('Erro:' + err));
    })
    .catch((err) => res.status(400).json('Erro:' + err));
});

module.exports = router