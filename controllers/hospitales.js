const {response} = require('express');
const Hospital = require('../models/hospital');
const {generarJWT} = require('../helpers/jwt');

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate('usuario','nombre img').populate('medico','nombre img');

  res.json({
    ok: true,
    hospitals: hospitales,
    // uid : req.uid
  });
};


const crearHospital = async (req, res = response) => {

  const uid = req.uid;
  const hospital = new Hospital({
    usuario: uid,
    ...req.body
  });

  try {

    //generar el token - JWT
    const token = await generarJWT(hospital.id);
    const hospitalDb = await hospital.save();
    res.json({
      ok: true,
      hospital: hospitalDb,
      token
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }


};

const borrarHospital = async  (req, res = response) => {
  const id = req.params.id;

  try {
    const hospitalDb = await Hospital.findById(id);
    if(!hospitalDb){
      return res.status(404).json({
        ok: false,
        msg: 'No existe hospital con es id'}
      );
    }

    await  Hospital.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: 'hospital Eliminado'
    });


  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }
};
const actualizarHospital = async (req, res = response) => {
  // TODO: Validar TOken y comprobar si el hospital es el correcto

  const id = req.params.id;
  const uid = req.uid;

  try {
    const hospitalDb = await Hospital.findById(id);
    if(!hospitalDb){
      return res.status(404).json({
        ok: false,
        msg: 'No existe hospital con es id'}
      );
    }
    const cambiosHospital = {
      ...req.body,
      usuario: uid,
    }

    const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

    hospitalDb.nombre = req.body.nombre;

    res.json({
      ok: true,
      hospital: hospitalActualizado
    });


  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
}