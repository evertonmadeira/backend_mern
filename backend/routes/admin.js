const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

let Admin = require("../models/admin.model");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

//Requisições ao DB
router.route("/").get((req, res) => {
  Admin.find()
    .then((admin) => res.json(admin))
    .catch((err) => res.status(400).json("Erro:" + err));
});

router.route("/register").post(async (req, res) => {
  const { adminEmail } = req.body;

  try {
    if (await Admin.findOne({ adminEmail }))
      return res.status(400).send({ Error: " Usuário já existe!" });

    const admin = await Admin.create(req.body);

    admin.password = undefined;

    return res.send({ admin, token: generateToken({ id: admin.id }) });
  } catch (err) {
    return res.status(400).send({ Error: "Problemas no registro." });
  }
});

// router.route("/sessions").post(async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ email })
//       .where("email", email)
//       .select("name");

//     if(!admin) {
//       return res.status(400).send({ Error: "Usuário não encontrado" });
//     }
//   } catch (error) {
//     res.status(400).send({error});
//   }
// });

router.route("/authenticate").post(async (req, res) => {
  const { adminEmail, password } = req.body;

  const admin = await Admin.findOne({ adminEmail }).select("+password");

  if (!admin) return res.status(400).send({ Error: "Usuário não encontrado" });

  if (!(await bcrypt.compare(password, admin.password)))
    return res.status(400).send({ Error: "Senha incorreta" });

  admin.password = undefined;

  return res.send({ admin, token: generateToken({ id: admin.id }) });
});

router.route("/:id").get((req, res) => {
  Admin.findById(req.params.id)
    .then((admin) => res.json(admin))
    .catch((err) => res.status(400).json("Erro:" + err));
});

router.route("/delete/:id").delete((req, res) => {
  Admin.findByIdAndDelete(req.params.id)
    .then(() => res.json("Usuário removido!"))
    .catch((err) => res.status(400).json("Erro:" + err));
});

router.route("/update/:id").post((req, res) => {
  Admin.findById(req.params.id)
    .then((admin) => {
      admin.name = req.body.name;
      admin.adminEmail = req.body.adminEmail;
      admin.password = req.body.password;

      admin
        .save()
        .then(() => res.json("Usuário alterado com sucesso!"))
        .catch((err) => res.status(400).json("Erro:" + err));
    })
    .catch((err) => res.status(400).json("Erro:" + err));
});

module.exports = router;
