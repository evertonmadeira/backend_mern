require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");

//Configurando Express
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(
  "/files",
  express.static(path.resolve(__dirname, ".", "tmp", "uploads"))
);

//Conectando MongoDB
const uri = process.env.COMPASS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB conectado...')
});

//Configurando Rotas
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const tableRouter = require("./routes/table");
const imageRouter = require("./routes/image");
const userControllerRouter = require("./routes/userController");
const adminControllerRouter = require("./routes/adminController");
const adminRouter = require("./routes/admin");

app.use('/product', productRouter);
app.use('/product-img', imageRouter);
app.use('/user', userRouter);
app.use('/table', tableRouter);
app.use('/usercontrol', userControllerRouter);
app.use('/admincontrol', adminControllerRouter);
app.use('/admin', adminRouter);

//Subindo servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



