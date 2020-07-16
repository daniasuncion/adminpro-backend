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
  const uid = req.params.id;

  try {
    const medicoDb = await Medico.findById(uid);
    if(!medicoDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe medico con es id'}
      );
    }
    //eliminar medico

    await Medico.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: 'Medico eliminado'
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
  // TODO: Validar TOken y comprobar si el medico es el correcto

  const uid = req.params.id;

  try {
    const medicoDb = await Medico.findById(uid);
    if(!medicoDb){
      res.status(404).json({
        ok: false,
        msg: 'No existe medico con es id'}
      );
    }
    //actualizacion
    const {password, google,email, ...campos} = req.body;

    if(medicoDb.email !== email){

      const existeEmail = await Medico.findOne({email : email});
      if(existeEmail){
        return res.status(400).json({
          ok:false,
          msg: 'Ya existe medico con ese email'
        });
      }
    }
    campos.email = email;

    const MedicoActualizado = await Medico.findByIdAndUpdate(uid, campos, { new :true });

    res.json({
      ok: true,
      MedicoActualizado
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