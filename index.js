require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config')


//crear servidor express
const app = express();

//Configurar CORS
app.use(cors())

//base de datos
dbConnection();

// console.log(process.env)
//rutas
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Hola Mundo'
  });
});

app.listen(process.env.PORT, () => {
  console.log('Servidor Corriendo puerto ' + process.env.PORT);
});