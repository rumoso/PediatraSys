import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ResponseDB_CRUD, ResponseGet } from 'src/app/interfaces/general.interfaces';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ServicesGService } from 'src/app/servicesG/servicesG.service';
import { environment } from 'src/environments/environment';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HistorialClinicoComponent } from '../mdl/historial-clinico/historial-clinico.component';

import * as moment from 'moment';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  private _appMain: string = environment.appMain;

  title: string = 'Consulta';
  bShowSpinner: boolean = false;
  id: number = 0;
  fechaNacimiento: string = ''

  pacienteData = {
    idPaciente: 0,
    name: '',
    edad: 0,
    textEdad: '',
    fechaNacimiento: ''
  };

  formConsulta: FormGroup = this.fb.group({
    idConsulta: 0,
    idPaciente: 0,
    createDate: [new Date(),[ Validators.required ]],
    peso: ['',[ Validators.required ]],
    talla: ['',[ Validators.required ]],
    pc: ['',[ Validators.required ]],
    motivoConsulta: [''],
    expFisica: [''],
    receta: [this.getRecetaConFecha(), [Validators.required]]
  });

  getRecetaConFecha(): string {
    // Sumar 15 días a la fecha actual
    moment.locale('es');
    const fechaCita = moment().add(15, 'days').format('DD/MMMM/YYYY');

    return `
    MEDICAMENTO suspensión de 500 mg (AMPICILINA)
    Ofrecer dosis vía oral c/ hrs, durante

    MEDICAMENTO suspensión de 500 mg (AMPICILINA)
    Ofrecer dosis vía oral c/ hrs, durante

    MEDICAMENTO suspensión de 500 mg (AMPICILINA)
    Ofrecer dosis vía oral c/ hrs, durante

    CITA: ${fechaCita} - 00:00 Hrs
    `;
  }

  constructor(
    private fb: FormBuilder
    , private router: Router
    , private activatedRoute: ActivatedRoute

    , private servicesGServ: ServicesGService
    , private _adapter: DateAdapter<any>
    , @Inject(MAT_DATE_LOCALE) private _locale: string
    , private pacientesServ: PacientesService
    , private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this._locale = 'mx';
    this._adapter.setLocale(this._locale);

    if(localStorage.getItem('pidPaciente')?.length! > 0){
      var idPaciente: number = +localStorage.getItem('pidPaciente')!;
      this.fn_getPaciente(idPaciente);
    }

    if( !this.router.url.includes('editarConsulta') ){
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.pacientesServ.getConsultaById( id ) )
      )
      .subscribe( data => {
        console.log(data)
         if(data.status == 0){
           this.id = data.data.rows.idConsulta;
           this.formConsulta.value.idPaciente = data.data.rows.idPaciente;

           this.formConsulta.setValue({
              idConsulta: data.data.rows.idConsulta,
              idPaciente: data.data.rows.idPaciente,
              createDate: data.data.rows.createDate,
              peso: data.data.rows.peso,// + 'T00:00:00'
              talla: data.data.rows.talla,
              pc: data.data.rows.pc,
              motivoConsulta: data.data.rows.motivoConsulta,
              expFisica: data.data.rows.expFisica,
              receta: data.data.rows.receta,
           });

           this.fn_getPaciente(data.data.rows.idPaciente);

           //this.fn_getHitorialClinicoByIdPaciente(this.id);
         }else{
            this.servicesGServ.showSnakbar(data.message);

            this.formConsulta.setValue({
              idConsulta: 0,
              idPaciente: 0,
              createDate: new Date(),
              peso: '',// + 'T00:00:00'
              talla: '',
              pc: '',
              motivoConsulta: '',
              expFisica: '',
              receta: '',
          });

          this.pacienteData = {
            idPaciente: 0,
            name: '',
            edad: 0,
            textEdad: '',
            fechaNacimiento: ''
          };
         }
      } )

  }

  showHistorialClinico(){

    var oData: any = {
      id: this.pacienteData.idPaciente
    }

    this.servicesGServ.showModalWithParams( HistorialClinicoComponent, oData, '1500px')
    .afterClosed().subscribe({
      next: ( resp: any ) =>{

        //this.fn_getClientesListWithPage();

      }
    });
  }

  crearConsultaDesdePaciente( idPaciente: number ){

    localStorage.setItem('pidPaciente', idPaciente.toString());
    this.servicesGServ.changeRoute( `/${ this._appMain }/consulta` );
  }

  changeRoute( route: string ): void {
    this.servicesGServ.changeRoute( `/${ this._appMain }/${ route }` );
  }

  fn_updateFechaNacimiento(){

    this.servicesGServ.showDialog('¿Estás seguro?'
                                      , 'Está a punto de cambiar la fecha de nacimiento del paciente'
                                      , '¿Desea continuar?'
                                      , 'Si', 'No')
    .afterClosed().subscribe({
      next: ( resp ) =>{
        if(resp){
          this.bShowSpinner = true;

          var oParam: any = {
            idPaciente: this.pacienteData.idPaciente,
            fechaNacimiento: this.pacienteData.fechaNacimiento
          }

          this.pacientesServ.updateFechaNacimiento(oParam)
          .subscribe({
            next: (resp: ResponseDB_CRUD) => {
              this.servicesGServ.showAlertIA( resp );
              this.bShowSpinner = false;
            },
            error: (ex: HttpErrorResponse) => {
              console.log( ex.error.errors[0].msg )
              this.servicesGServ.showSnakbar( ex.error.errors[0].msg );
              this.bShowSpinner = false;
            }

          })
        }
      }
    });
  }

  fn_getPaciente(idPaciente: number){

    this.pacientesServ.getPacienteByID( idPaciente )
    .subscribe( data => {
      console.log(data)
       if(data.status == 0)
       {
          //this.id = data.data.idPaciente;

          this.pacienteData.idPaciente = data.data.idPaciente;
          this.pacienteData.name = data.data.name + " - " + data.data.edad.toString() + " " + data.data.textEdad;
          this.pacienteData.edad = data.data.edad;
          this.pacienteData.textEdad = data.data.textEdad;
          this.pacienteData.fechaNacimiento = data.data.fechaNacimiento + 'T00:00:00';
          //  this.catForm.setValue({
          //   idPaciente: data.data.idPaciente,
          //    name: data.data.name,
          //    fechaNacimiento: data.data.fechaNacimiento + 'T00:00:00'
          //  });


          //this.fn_getHitorialClinicoByIdPaciente(this.id);
       }
       else
       {
        this.servicesGServ.showSnakbar(data.message);
       }
    } );

  }

  // fn_getHitorialClinicoByIdPaciente( idPaciente: number ) {
  //   this.bShowSpinner = true;
  //     this.pacientesServ.getHitorialClinicoByIdPaciente( idPaciente )
  //       .subscribe({
  //         next: (data: ResponseGet) => {

  //           if( data.status === 0 ){
  //             this.formHistorialClinico.setValue({
  //               idHistClinico: data.data.rows.idHistClinico,
  //               idPaciente: data.data.rows.idPaciente,
  //               motivoConsulta: data.data.rows.motivoConsulta,
  //               antePersonNoPatologicos: data.data.rows.antePersonNoPatologicos,
  //               antePersonPatologicos: data.data.rows.antePersonPatologicos,
  //               antePerinatales: data.data.rows.antePerinatales,
  //               padecimientoActual: data.data.rows.padecimientoActual,
  //               exploracionFisica: data.data.rows.exploracionFisica,
  //               diagnosticosProbables: data.data.rows.diagnosticosProbables,
  //              });
  //           }else{
  //             this.servicesGServ.showSnakbar(data.message);
  //           }

  //           this.bShowSpinner = false;
  //         },
  //         error: (ex) => {
  //           this.servicesGServ.showSnakbar( "Problemas con el servicio" );
  //           this.bShowSpinner = false;
  //         }
  //       })
  // }


  // changeRoute( route: string ): void {
  //   this.servicesGServ.changeRoute( `/${ this._appMain }/${ route }` );
  // }



  fn_saveConsulta() {
    this.bShowSpinner = true;

    this.formConsulta.value.idPaciente = this.pacienteData.idPaciente;
    if(this.id > 0){
      this.pacientesServ.updateConsulta( this.formConsulta.value )
        .subscribe({
          next: (resp: ResponseDB_CRUD) => {

            this.servicesGServ.showAlertIA( resp );
            this.bShowSpinner = false;
          },
          error: (ex) => {
            this.servicesGServ.showSnakbar( "Problemas con el servicio" );
            this.bShowSpinner = false;
          }
        })
    }else{
    this.pacientesServ.insertConsulta( this.formConsulta.value )
      .subscribe({
        next: (resp: ResponseDB_CRUD) => {
          if( resp.status === 0 ){
            this.id = resp.insertID;
          }
          this.servicesGServ.showAlertIA( resp );
          this.bShowSpinner = false;
        },
        error: (ex) => {
          this.servicesGServ.showSnakbar( "Problemas con el servicio" );
          this.bShowSpinner = false;
        }
      })
    }
  }

  // fn_saveHistClinico() {

  //   this.formHistorialClinico.value.idPaciente = this.id;

  //   this.bShowSpinner = true;
  //   if( this.formHistorialClinico.value.idHistClinico > 0){
  //     this.pacientesServ.updateHitorialClinico( this.formHistorialClinico.value )
  //       .subscribe({
  //         next: (resp: ResponseDB_CRUD) => {

  //           this.servicesGServ.showAlertIA( resp );
  //           this.bShowSpinner = false;
  //         },
  //         error: (ex) => {
  //           this.servicesGServ.showSnakbar( "Problemas con el servicio" );
  //           this.bShowSpinner = false;
  //         }
  //       })
  //   }else{
  //     console.log( this.formHistorialClinico.value )
  //   this.pacientesServ.insertHitorialClinico( this.formHistorialClinico.value )
  //     .subscribe({
  //       next: (resp: ResponseDB_CRUD) => {
  //         if( resp.status === 0 ){
  //           this.formHistorialClinico.value.idHistClinico = resp.insertID;
  //         }
  //         this.servicesGServ.showAlertIA( resp );
  //         this.bShowSpinner = false;
  //       },
  //       error: (ex) => {
  //         this.servicesGServ.showSnakbar( "Problemas con el servicio" );
  //         this.bShowSpinner = false;
  //       }
  //     })
  //   }
  // }

  downloadPDF(){

    var doc = new jsPDF('p', 'mm', [297, 210]);

    var nombre = this.pacienteData.name;
    var createDate = this.formConsulta.value.createDate;
    var peso = this.formConsulta.value.peso;
    var talla = this.formConsulta.value.talla;
    var pc = this.formConsulta.value.pc;

    var receta = this.formConsulta.value.receta;

    //doc.setFont("helvetica")
    doc.setFontSize(10);

    var line = 40;
    //87
    doc.text('Guasave, Sinaloa '+  this.datepipe.transform(createDate,'dd/MM/yyyy'), 10, line);
    line += 5;

    doc.text('NOMBRE: '+ nombre, 10, line);
    line += 5;

    doc.text('Peso: ' + peso + ' Temp: ' + pc + ', T: ' + talla, 10, line);
    line += 10;


    doc.text(receta, 10, line);


    doc.save("receta_" + nombre + "_"+ this.datepipe.transform(createDate,'ddMMyyyy') +".pdf");
  }


}
