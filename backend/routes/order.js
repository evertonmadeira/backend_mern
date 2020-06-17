const router = require('express').Router();

let Order = require("../models/order.model");


router.route('/').get((req, res) => {
  Order.find()
    .then(orders => res.json(orders))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/').post(async (req, res) => {
  try {
    const data = req.body;

    data.pedidos.map(pedido => {
      data.total += pedido.preco * pedido.quantity
    });

    // console.log(data);

    const newOrder = new Order({
      mesa: data.mesa,
      status: data.status,
      pedidos: data.pedidos,
      total: data.total
    });

    await newOrder.save()
    return res.json('Pedido realizado!')
  } catch (error) {
    return res.status(400).json('Erro: ' + error);
  }
});

router.route('/:id').put((req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      order.status = req.body.status;

      order.save()
        .then(() => res.json('Status alterado!'))
        .catch((err) => res.status(400).json('Erro:' + err));
    })
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/:id').delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json('Pedido excluído!'))
    .catch((err) => res.status(400).json('Erro: ' + err));
});

module.exports = router