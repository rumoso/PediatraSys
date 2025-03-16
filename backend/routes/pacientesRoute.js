const { Router } = require('express');
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')

const { 
    getPacientesListWithPage
    , getPacienteByID
    , insertPaciente
    , updatePaciente
    , deletePaciente
    
    , getHitorialClinicoByIdPaciente
    , insertHitorialClinico
    , updateHitorialClinico
    
    , getConsultaById
    , insertConsulta
    , updateConsulta

    , getConsultaListWithPage
    , deleteConsulta

    , updateFechaNacimiento
   } = require('../controllers/pacientesController');

   
const router = Router();

router.post('/getPacientesListWithPage', getPacientesListWithPage);

router.post('/getPacienteByID', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),
  validarCampos
], getPacienteByID);

router.post('/insertPaciente', [
  check('name','Nombre obligatorio').not().isEmpty(),
  check('fechaNacimiento','fecha de nacimiento obligatoria').not().isEmpty(),

  validarCampos
], insertPaciente);

router.post('/updatePaciente', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),

  check('name','Nombre obligatorio').not().isEmpty(),

  validarCampos
], updatePaciente);

router.post('/deletePaciente', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),
  validarCampos
], deletePaciente);

router.post('/getHitorialClinicoByIdPaciente', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),
  validarCampos
], getHitorialClinicoByIdPaciente);

router.post('/insertHitorialClinico', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),

  check('motivoConsulta','El motivo de la consulta es obligatorio').not().isEmpty(),
  validarCampos
], insertHitorialClinico);

router.post('/updateHitorialClinico', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),

  check('motivoConsulta','El motivo de la consulta es obligatorio').not().isEmpty(),
  validarCampos
], updateHitorialClinico);


router.post('/getConsultaById', [
  check('idConsulta','Id obligatorio').not().isEmpty(),
  check('idConsulta','Id debe ser numérico').isNumeric(),
  validarCampos
], getConsultaById);

router.post('/insertConsulta', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),

  check('createDate','Fecha obligatoria').not().isEmpty(),
  check('peso','Peso obligatorio').not().isEmpty(),
  check('talla','Talla obligatoria').not().isEmpty(),
  check('pc','Temperatura obligatorio').not().isEmpty(),
  check('receta','Receta obligatoria').not().isEmpty(),

  validarCampos
], insertConsulta);

router.post('/updateConsulta', [

  check('createDate','Fecha obligatoria').not().isEmpty(),
  check('peso','Peso obligatorio').not().isEmpty(),
  check('talla','Talla obligatoria').not().isEmpty(),
  check('pc','Temperatura obligatorio').not().isEmpty(),
  check('receta','Receta obligatoria').not().isEmpty(),

  validarCampos
], updateConsulta);

router.post('/getConsultaListWithPage', getConsultaListWithPage);

router.post('/deleteConsulta', [
  check('idConsulta','Id obligatorio').not().isEmpty(),
  check('idConsulta','Id debe ser numérico').isNumeric(),
  validarCampos
], deleteConsulta);

router.post('/updateFechaNacimiento', [
  check('idPaciente','Id obligatorio').not().isEmpty(),
  check('idPaciente','Id debe ser numérico').isNumeric(),

  check('fechaNacimiento','Nombre obligatorio').not().isEmpty(),

  validarCampos
], updateFechaNacimiento);

module.exports = router;