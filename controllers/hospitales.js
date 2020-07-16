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
  const uid = req.params.id;

  try {
    const hospitalDb = await Hospital.findById(uid);
    if(!hospitalDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe hospital con es id'}
      );
    }
    //eliminar hospital

    await Hospital.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: 'Hospital eliminado'
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

  const uid = req.params.id;

  try {
    const hospitalDb = await Hospital.findById(uid);
    if(!hospitalDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe hospital con es id'}
      );
    }
    //actualizacion
    const {password, google,email, ...campos} = req.body;

    if(hospitalDb.email !== email){

      const existeEmail = await Hospital.findOne({email : email});
      if(existeEmail){
        return res.status(400).json({
          ok:false,
          msg: 'Ya existe hospital con ese email'
        });
      }
    }
    campos.email = email;

    const HospitalActualizado = await Hospital.findByIdAndUpdate(uid, campos, { new :true });

    res.json({
      ok: true,
      HospitalActualizado
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