const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.route('/').get((req, res) => {
  res.send({ ok: 'my friend', user: req.userId})
});

module.exports = router;