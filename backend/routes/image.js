const router = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");

const Image = require("../models/image.model");

router.route('/').get(async (req, res) => {
  const img = await Image.find();

  return res.json(img);
});


router.route('/add').post(multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;

  const img = await Image.create({
    name,
    size,
    key,
    url
  });

  return res.json(img);

})

router.route('/delete/:id').delete( async (req, res) => {
  const img = await Image.findById(req.params.id);

  await img.remove();

  return res.send();
});

module.exports = router;