const router = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");

let Category = require("../models/category.model");

router.route('/').get((req, res) => {
  Category.find().sort({ "nome": 1 })
    .then(category => res.json(category))
    .catch((err) => res.status(400).json('Problema ao acessar os dados:' + err));
});

router.route('/').post(multer(multerConfig).single("file"), async (req, res) => {
  const nome = req.body.nome;

  const { originalname: name, size, key, location: url = "" } = req.file;

  const img = {
    name,
    size,
    key,
    url
  };

  const newCategory = new Category({
    nome,
    img
  });

  newCategory.save()
    .then(() => res.json('Categoria adicionada!'))
    .catch((err) => res.status(400).json('Erro ao adicionar categoria:' + err));
});

module.exports = router