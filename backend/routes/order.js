const router = require('express').Router();

let Order = require("../models/order.model");


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
    return res.status(400).json('Erro: ' + error);
  }

});

router.route('/').post(async (req, res) => {
  try {
    const data = req.body;

    const validation = await Order.find({ mesa: data.mesa }, (order) => { return order; });

    if (validation.length == 0) {
      data.pedidos.map(pedido => {
        data.total += pedido.preco * pedido.quantity
      });

      const newOrder = new Order({
        mesa: data.mesa,
        status: data.status,
        pedidos: data.pedidos,
        total: data.total
      });

      await newOrder.save()

      return res.json('Pedido realizado!');

    } else if (validation.length != 0 && validation[0].status === 'Aberto') {
      return res.json('Pedido aberto');

    } else if (validation.length != 0 && validation[0].status === 'Em produção') {
      return res.json('Pedido aberto');

    } else if (validation.length != 0 && validation[0].status === 'Finalizado') {
      console.log('Tem pedido finalizado');
      return res.json('Pedido finalizado');

    }
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

router.route('/:number/:id').delete((req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.json('Pedido excluído!'))
    .catch((err) => res.status(400).json('Erro: ' + err));
});

module.exports = router