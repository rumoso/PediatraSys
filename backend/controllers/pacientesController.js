const { response } = require('express');
const bcryptjs = require('bcryptjs');
const moment = require('moment');

const { dbConnection } = require('../database/config');

const getPacientesListWithPage = async(req, res = response) => {

    const {
        search = '', limiter = 10, start = 0
    } = req.body;

    console.log(req.body)

    try{

        var OSQL = await dbConnection.query(`call getPacientesListWithPage('${ search }',${ start },${ limiter })`)
//console.log(OSQL)
        if(OSQL.length == 0){

            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                count: 0,
                rows: null
                }
            });

        }
        else{

            const iRows = ( OSQL.length > 0 ? OSQL[0].iRows: 0 );
            
            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                count: iRows,
                rows: OSQL
                }
            });
            
        }
        
    }catch(error){
      
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error
        });
    }
};

const getPacienteByID = async(req, res = response) => {

  const {
    idPaciente
  } = req.body;

  console.log(req.body)

  var OSQL = await dbConnection.query(`call getPacienteByID(${ idPaciente })`)

  if(OSQL.length == 0){

        res.json({
            status:1,
            message:"No se encontró información.",
            data: null
        });

    }
    else{

        res.json({
            status:0,
            message:"Ejecutado correctamente.",
            data: OSQL[0]
        });
        
    }

};

const insertPaciente = async(req, res) => {
   
  const {
    name,
    fechaNacimiento = ''
  } = req.body;

  console.log(req.body)

  try{

      var OSQL = await dbConnection.query(`call insertPaciente(
          '${name}'
          , '${fechaNacimiento.substring(0, 10)}'
          )`)

      res.json({
          status:0,
          message:"Paciente guardado con éxito.",
          insertID: OSQL[0].out_id
      });
      
  }catch(error){
      
      res.status(500).json({
          status:2,
          message:"Sucedió un error inesperado",
          data:error
      });
  }
}

const updatePaciente = async(req, res) => {
   
  const {
    idPaciente,
    name = '',
    fechaNacimiento = ''
  } = req.body;

  console.log(req.body)

  try{

      var OSQL = await dbConnection.query(`call updatePaciente(
          ${idPaciente}  
          , '${name}'
          , '${fechaNacimiento.substring(0, 10)}'
          )`)

      res.json({
          status:0,
          message:"Paciente actualizado con éxito.",
          insertID: OSQL[0].out_id
      });
      
  }catch(error){
      
      res.status(500).json({
          status:2,
          message:"Sucedió un error inesperado",
          data:error
      });
  }
}

const deletePaciente = async(req, res) => {
   
  const {
    idPaciente
  } = req.body;

  console.log(req.body)

  try{

      var OSQL = await dbConnection.query(`call deletePaciente(
          ${idPaciente}
          )`)

      res.json({
          status:0,
          message:"Paciente eliminado con éxito.",
          insertID: OSQL[0].out_id
      });
      
  }catch(error){
      
      res.status(500).json({
          status:2,
          message:"Sucedió un error inesperado",
          data:error
      });
  }
}

const getHitorialClinicoByIdPaciente = async(req, res = response) => {

    const {
        idPaciente
    } = req.body;

    console.log(req.body)

    try{

        var OSQL = await dbConnection.query(`call getHitorialClinicoByIdPaciente( ${ idPaciente } )`)

        if(OSQL.length == 0){

            res.json({
                status:1,
                message:"No tiene historial clínico este paciente.",
                data:{
                count: 0,
                rows: null
                }
            });

        }
        else{

            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                rows: OSQL[0]
                }
            });
            
        }
        
    }catch(error){
      
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
};

const insertHitorialClinico = async(req, res) => {
   
    const {
        idPaciente
        ,motivoConsulta
        ,antePersonNoPatologicos = ''
        ,antePersonPatologicos = ''
        ,antePerinatales = ''
        ,padecimientoActual = ''
        ,exploracionFisica = ''
        ,diagnosticosProbables = ''
    } = req.body;
  
    console.log(req.body)
  
    try{
  
        var OSQL = await dbConnection.query(`call insertHitorialClinico(
            ${idPaciente}
            , '${motivoConsulta}'
            , '${antePersonNoPatologicos}'
            , '${antePersonPatologicos}'
            , '${antePerinatales}'
            , '${padecimientoActual}'
            , '${exploracionFisica}'
            , '${diagnosticosProbables}'
            )`)
            
        res.json({
            status:0,
            message:"Historial clínico del Paciente guardado con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
  }
  
const updateHitorialClinico = async(req, res) => {
    
    const {
        idHistClinico
        ,motivoConsulta
        ,antePersonNoPatologicos = ''
        ,antePersonPatologicos = ''
        ,antePerinatales = ''
        ,padecimientoActual = ''
        ,exploracionFisica = ''
        ,diagnosticosProbables = ''
    } = req.body;

    console.log(req.body)

    try{

        var OSQL = await dbConnection.query(`call updateHitorialClinico(
            ${idHistClinico}
            , '${motivoConsulta}'
            , '${antePersonNoPatologicos}'
            , '${antePersonPatologicos}'
            , '${antePerinatales}'
            , '${padecimientoActual}'
            , '${exploracionFisica}'
            , '${diagnosticosProbables}'
            )`)

        res.json({
            status:0,
            message:"Historial clínico del Paciente actualizado con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
}

const getConsultaById = async(req, res = response) => {

    const {
        idConsulta
    } = req.body;

    console.log(req.body)

    try{

        var OSQL = await dbConnection.query(`call getConsultaById( ${ idConsulta } )`)

        if(OSQL.length == 0){

            res.json({
                status:1,
                message:"No existe la consulta.",
                data:{
                count: 0,
                rows: null
                }
            });

        }
        else{

            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                rows: OSQL[0]
                }
            });
            
        }
        
    }catch(error){
      
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
};

const insertConsulta = async(req, res) => {
   
    var {
        createDate
        ,idPaciente
        ,peso = ''
        ,talla = ''
        ,pc = ''
        ,motivoConsulta = ''
        ,expFisica = ''
        ,receta = ''
    } = req.body;
  
    console.log(req.body)
  
    try{

        
        var oGetDateNow = moment().format('YYYY-MM-DD HH:mm:ss');
        var oHrs = moment().format(' HH:mm:ss');
        //console.log(oGetDateNow)

        createDate = createDate.substring(0, 10) + oHrs;
        //console.log(createDate)
  
        var OSQL = await dbConnection.query(`call insertConsulta(
            '${createDate}'
            , ${idPaciente}
            , '${peso}'
            , '${talla}'
            , '${pc}'
            , '${motivoConsulta}'
            , '${expFisica}'
            , '${receta}'
            )`)
            
        res.json({
            status:0,
            message:"Consulta guardada con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
  }
  
const updateConsulta = async(req, res) => {
     
    var {
        idConsulta
        ,createDate
        ,peso = ''
        ,talla = ''
        ,pc = ''
        ,motivoConsulta = ''
        ,expFisica = ''
        ,receta = ''
    } = req.body;
  
    console.log(req.body)
  
    try{

        var oGetDateNow = moment().format('YYYY-MM-DD HH:mm:ss');
        var oHrs = moment().format(' HH:mm:ss');
        console.log(oGetDateNow)

        createDate = createDate.substring(0, 10) + oHrs;
        console.log(createDate)
  
        var OSQL = await dbConnection.query(`call updateConsulta(
            ${idConsulta}
            , '${createDate}'
            , '${peso}'
            , '${talla}'
            , '${pc}'
            , '${motivoConsulta}'
            , '${expFisica}'
            , '${receta}'
            )`)

        res.json({
            status:0,
            message:"Consulta actualizada con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error.message
        });
    }
  }

const getConsultaListWithPage = async(req, res = response) => {

    const {
        search = '', limiter = 10, start = 0
    } = req.body;

    console.log(req.body)

    try{
        var OSQL = await dbConnection.query(`call getConsultaListWithPage('${ search }',${ start },${ limiter })`)
//console.log(OSQL)
        if(OSQL.length == 0){

            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                count: 0,
                rows: null
                }
            });

        }
        else{

            const iRows = ( OSQL.length > 0 ? OSQL[0].iRows: 0 );
            
            res.json({
                status:0,
                message:"Ejecutado correctamente.",
                data:{
                count: iRows,
                rows: OSQL
                }
            });
            
        }
        
    }catch(error){
      
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error
        });
    }
};

const deleteConsulta = async(req, res) => {
   
    const {
        idConsulta
    } = req.body;
  
    console.log(req.body)
  
    try{
  
        var OSQL = await dbConnection.query(`call deleteConsulta(
            ${idConsulta}
            )`)
  
        res.json({
            status:0,
            message:"Consulta eliminada con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error
        });
    }
  }

const updateFechaNacimiento = async(req, res) => {

    const {
        idPaciente,
        fechaNacimiento = ''
    } = req.body;

    console.log(req.body)

    try{

        var OSQL = await dbConnection.query(`call updateFechaNacimiento(
            ${idPaciente}  
            , '${fechaNacimiento.substring(0, 10)}'
            )`)

        res.json({
            status:0,
            message:"Fecha actualizada con éxito.",
            insertID: OSQL[0].out_id
        });
        
    }catch(error){
        
        res.status(500).json({
            status:2,
            message:"Sucedió un error inesperado",
            data:error
        });
    }
}

module.exports = {
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
  }