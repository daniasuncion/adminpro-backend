const {response} = require('express');
const Medico = require('../models/medico');
const {generarJWT} = require('../helpers/jwt');

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find().populate('usuario','nombre img').populate('hospital','nombre img');

  res.json({
    ok: true,
    medicos: medicos,
    // uid : req.uid
  });
};


const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico(req.body);

  try {
    //generar el token - JWT
    const token = await generarJWT(medico.id);
    const medicoDb = await medico.save()

    await medico.save();
    res.json({
      ok: true,
      medico: medicoDb,
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


const borrarMedico = async  (req, res = response) => {
  const id = req.params.id;

  try {
    const medicoDb = await Medico.findById(id);
    if(!medicoDb){
      return res.status(404).json({
        ok: false,
        msg: 'No existe medico con es id'}
      );
    }

    await  Medico.findByIdAndDelete(id);
    res.json({
      ok: true,
      msg: 'medico Eliminado'
    });


  }catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... Revisar Logs'}
    );
  }
};
const actualizarMedico = async (req, res = response) => {

  const id = req.params.id;
  const uid = req.uid;

  try {
    const medicoDb = await Medico.findById(id);
    if(!medicoDb){
      return res.status(404).json({
        ok: false,
        msg: 'No existe medico con es id'}
      );
    }
    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    }

    const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

    medicoDb.nombre = req.body.nombre;

    res.json({
      ok: true,
      medico: medicoActualizado
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
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico
}