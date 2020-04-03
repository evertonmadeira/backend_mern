const router = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");

let Product = require("../models/product.model");

//Requisições ao DB
router.route('/').get((req, res) => {
  Product.find()
    .then(products => res.json(products))
    .catch((err) => res.status(400).json('Problema ao acessar os dados:' + err));
});

router.route('/add').post(multer(multerConfig).single("file"), async (req, res) => {
  const nome = req.body.nome;
  const descricao = req.body.descricao;
  const categoria = req.body.categoria;
  const preco = Number(req.body.preco);

  const { originalname: name, size, key, location: url = "" } = req.file;
  
  const img = {
    name,
    size,
    key,
    url
  };

  const newProduct = new Product({
    nome,
    descricao,
    categoria,
    preco,
    img
  });

  newProduct.save()
    .then(() => res.json('Produto adicionado com sucesso!'))
    .catch((err) => res.status(400).json('Erro ao adicionar produto:' + err));
});

router.route('/:id').get((req, res) => {
  Product.findById(req.params.id)
    .then(product => res.json(product))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/delete/:id').delete((req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.json('Produto removido!'))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/update/:id').post((req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      product.nome = req.body.nome;
      product.descricao = req.body.descricao;
      product.categoria = req.body.categoria;
      product.preco = Number(req.body.preco);

      product.save()
        .then(() => res.json('Produto alterado com sucesso!'))
        .catch((err) => res.status(400).json('Erro:' + err));
    })
    .catch((err) => res.status(400).json('Erro:' + err));
});

module.exports = router