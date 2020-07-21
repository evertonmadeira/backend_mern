const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

let Table = require("../models/table.model");
let Register = require("../models/register.model");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

// Requisições ao DB
// Listagem das mesas utilizando o método GET
router.route('/').get((request, response) => {
  // Método find para buscar as mesas cadastradas no banco de dados
  Table.find()
    // Função retornando as mesas encontradas e quantidade destas
    .then(tables => response.json([tables, tables.length]))
    .catch((err) => response.status(400).json('Erro:' + err));
});

// Operação de cadastro de mesas utilizando método POST
router.route('/add').post((request, response) => {
  // Variáveis que assumem os valores do corpo da requisição enviadas pelo usuário
  const num = Number(request.body.num);
  const estado = request.body.estado;

  // Instancia do model Table
  const newTable = new Table({
    num,
    estado,
  });

  // Método save para salvar os dados no banco
  newTable.save()
    .then(() => response.json('Mesa adicionada com sucesso!'))
    .catch((err) => response.status(400).json('Erro:' + err));
});

// Método para exclusão de mesas utilizando método DELETE
router.route('/delete/:id').delete((request, response) => {
  // A mesa é selecionada de acordo com seu identificador (id) e então excluída
  Table.findByIdAndDelete(request.params.id)
    // O retorno é apenas uma messagem, afinal, não faz sentido retornar a mesa excluída
    .then(() => response.json('Mesa removida!'))
    .catch((err) => response.status(400).json('Erro:' + err));
});

// Edição dos dados da mesa
// Como na operação de exclusão, a edição faz uma busca pelo identificador da mesa
router.route('/update/:id').post((request, response) => {
  Table.findById(request.params.id)
    // Primeiro recebe os novos dados do corpo da requisição
    .then(table => {
      table.num = request.body.num;
      table.estado = request.body.estado;

      // Depois salva os novos dados de acordo com a mesa selecionada (pelo id)
      table.save()
        .then(() => response.json('Dados alterados!'))
        .catch((err) => response.status(400).json('Erro:' + err));
    })
    .catch((err) => response.status(400).json('Erro:' + err));
});

router.route('/:id').get((request, response) => {
  Table.findById(request.params.id)
    .then(table => response.json(table))
    .catch((err) => response.status(400).json('Erro:' + err));
});

module.exports = router