const router = require("express").Router();
let Table = require("../models/table.model");

//Requisições ao DB
router.route('/').get((req, res) => {
  Table.find()
    .then(tables => res.json(tables))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/add').post((req, res) => {
  const num = Number(req.body.num);
  const estado = req.body.estado;
  const qrcode = req.body.qrcode;

  const newTable = new Table({
    num,
    estado,
    qrcode
  });

  newTable.save()
    .then(() => res.json('Mesa adicionada com sucesso!'))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/:id').get((req, res) => {
  Table.findById(req.params.id)
    .then(table => res.json(table))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/delete/:id').delete((req, res) => {
  Table.findByIdAndDelete(req.params.id)
    .then(() => res.json('Mesa removida!'))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/update/:id').post((req, res) => {
  Table.findById(req.params.id)
    .then(table => {
      table.num = req.body.num;
      table.estado = req.body.estado;
      table.qrcode = req.body.qrcode;
      
      table.save()
        .then(() => res.json('Dados alterados!'))
        .catch((err) => res.status(400).json('Erro:' + err));
    })
    .catch((err) => res.status(400).json('Erro:' + err));
});

module.exports = router