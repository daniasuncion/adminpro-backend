require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config')


//crear servidor express
const app = express();

//Configurar CORS
app.use(cors())

//Lectura y parseo del body
app.use(express.json());

//base de datos
dbConnection();

// console.log(process.env)
//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
  console.log('Servidor Corriendo puerto ' + process.env.PORT);
});