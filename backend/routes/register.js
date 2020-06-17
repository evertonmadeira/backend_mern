const router = require('express').Router();

let Register = require("../models/register.model");
let Table = require("../models/table.model");


router.route('/').get((req, res) => {
  Register.find()
    .then(registers => res.json(registers))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route("/:name/:id").post(async (req, res) => {
  const { id, name } = req.params

  try {
    const table = await Table.findById(id);

    if (table && table.estado === "Livre") {
      const newRegister = new Register({
        occupied_table: table.num,
        client_name: name,
        occupation_time: new Date()
      });

      table.estado = "Ocupada";
      await table.save();
      await newRegister.save();

      return res.json(newRegister)
    } else if (!table) {
      return res.json('Não existe mesa com esse código!');
    } else if (table.estado === "Ocupada") {
      return res.json('Você já ocupou a mesa!');

    }

  } catch (error) {
    return res.status(400).json('Problemas ao ocupar a mesa:' + error);
  }
});

router.route('/:id').put(async (req, res) => {
  const { id } = req.params;

  try {
    const register = await Register.findById(id);
    const table = await Table.findOne({ num: register.occupied_table });

    if (register && table) {
      register.vacancy_time = new Date();

      table.estado = "Livre";

      await register.save();
      await table.save();

      return res.json(`Mesa ${table.num} desocupada, até a próxima!`)
    }
  } catch (error) {
    return res.json('Problemas ao desocupar a mesa:' + error);
  }


});

module.exports = router