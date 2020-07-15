const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DBCONNECTION,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    console.log('BBDD ONLINE')
  }catch (error) {
    console.log(error);
    throw new Error('Error al iniciar bbdd. Ver logs...');
  }


};

module.exports = {
  dbConnection
}

