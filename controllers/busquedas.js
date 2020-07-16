const {response} = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const getTodo = async (req, res = response) => {


  const [usuarios,medicos,hospitales] = await Promise.all([
   Usuario.find({nombre: new RegExp(req.params.busqueda, 'i') }),
   Medico.find({nombre: new RegExp(req.params.busqueda, 'i') }),
   Hospital.find({nombre: new RegExp(req.params.busqueda, 'i') })
  ]);

  res.json({
    ok: true,
    msg:'getTodo',
    usuarios,
    medicos,
    hospitales
  })

}


const getDocumentosColeccion = async (req, res = response) => {

  let data = [];
  switch (req.params.tabla) {
    case 'medicos':
      data = await  Medico.find({nombre : new RegExp(req.params.busqueda)})
          .populate('usuario', 'nombre img')
          .populate('hospital', 'nombre img');
      break;
    case 'hospitales':
      data = await  Hospital.find({nombre : new RegExp(req.params.busqueda)})
          .populate('usuario', 'nombre img');
      break;
    case 'usuarios':
      data = await  Usuario.find({nombre : new RegExp(req.params.busqueda)});
      break;
    default:
      return res.status(400).json({
        ok: false,
        msg: 'La tabla tiene que ser usuarios, medicos u hospitales'
      });
      break;

  }
  res.json({
    ok: true,
    resultados : data
  });

  // const [usuarios,medicos,hospitales] = await Promise.all([
  //   Usuario.find({nombre: new RegExp(req.params.busqueda, 'i') }),
  //   Medico.find({nombre: new RegExp(req.params.busqueda, 'i') }),
  //   Hospital.find({nombre: new RegExp(req.params.busqueda, 'i') })
  // ]);
  // res.json({
  //   ok: true,
  //   msg:'getTodo',
  //   usuarios,
  //   medicos,
  //   hospitales
  // })

}


module.exports = {
  getTodo,
  getDocumentosColeccion
}
