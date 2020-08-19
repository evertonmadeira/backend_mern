const router = require('express').Router();

let Order = require("../models/order.model");
let Table = require("../models/table.model");

router.route('/').get((req, res) => {
  Order.find()
    .then(orders => res.json(orders))
    .catch((err) => res.status(400).json('Erro:' + err));
});

router.route('/status').get(async (req, res) => {
  try {
    let opened = [];
    let making = [];
    let finished = [];

    let countOpened = 0;
    let countMaking = 0;
    let countFinished = 0;

    const data = await Order.find();

    data.map((order) => {
      if (order.status === 'Aberto') {
        opened.push(order);
        countOpened += 1;
      } else if (order.status === 'Em produção') {
        making.push(order);
        countMaking += 1;
      } else if (order.status === 'Finalizado') {
        finished.push(order);
        countFinished += 1;
      }
    });

    return res.send([{ opened, countOpened, making, countMaking, finished, countFinished }]);

  } catch (error) {
    res.status(400).json('Erro: ' + error)
  }
});

router.route('/:number').get(async (req, res) => {
  try {
    const number = req.params.number;

    const data = await Order.find({ mesa: number }, (order) => { return order; });

    function filterByStatus(order) {

      if (order.status === 'Aberto') {
        return order;
      } else if (order.status === 'Em produção') {
        return order;
      } else if (order.status === 'Finalizado') {
        return order;
      }
    }

    const test = data.map(item => filterByStatus(item));

    return res.json(test);

  } catch (error) {
    console.log(error)
    return res.status(400).json('Erro: ' + error);
  }

});

router.route('/').post(async (req, res) => {
  try {

    const data = req.body;

    let count = 0;

    const arrayData = await Order.find({ mesa: data.mesa });

    const findTable = await Table.findOne({ num: data.mesa });

    const showAllOrders = arrayData.map(order => {
      return order;
    })

    data.pedidos.map(pedido => {
      data.subtotal += pedido.preco * pedido.quantity;
    });

    const totalGeral = arrayData.reduce((acc, order) => {
      acc += order.subtotal;

      return acc
    }, data.subtotal);

    if (arrayData.length == 0) {
      count = 1;
    } else {
      count = Number(arrayData[arrayData.length - 1].order_number + 1);
    };

    const newOrder = new Order({
      mesa: data.mesa,
      status: data.status,
      pedidos: data.pedidos,
      order_number: count,
      subtotal: data.subtotal,
    });

    findTable.total = totalGeral;
    findTable.is_paid = false;

    await findTable.save();

    await newOrder.save();

    return res.json('Pedido realizado!');

  } catch (error) {
    console.log(error)
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

router.route('/:number/:id').delete(async (req, res) => {
  try {
    const findTable = await Table.findOne({ num: req.params.number });

    const findOrder = await Order.findById(req.params.id);

    // if (findTable && findOrder && findTable.total > 0) {
    //   findTable.total = findTable.total - findOrder.subtotal;
    // } else {
    //   findTable.total = findTable.total;
    // }

    // await findTable.save();

    await Order.findByIdAndDelete(findOrder.id);

    res.json('Pedido excluído!');
  } catch (error) {
    return res.status(400).json('Erro: ' + error);
  }
});

module.exports = router