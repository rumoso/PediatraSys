import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { ServicesGService } from 'src/app/servicesG/servicesG.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ResponseDB_CRUD, ResponseGet } from 'src/app/interfaces/general.interfaces';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  private _appMain: string = environment.appMain;

  title: string = 'Paciente';
  bShowSpinner: boolean = false;
  id: number = 0;
  fechaNacimiento: string = ''

  catForm: FormGroup = this.fb.group({
    idPaciente: 0,
    name: ['',[ Validators.required ]],
    fechaNacimiento: [this.formatDate(new Date()), [Validators.required]],
  });

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0] + 'T00:00:00'; // Obtiene solo la parte de la fecha
  }

  formHistorialClinico: FormGroup = this.fb.group({
    idHistClinico: 0,
    idPaciente: 0,
    motivoConsulta: ['',[ Validators.required ]],
    antePersonNoPatologicos: [''],
    antePersonPatologicos: [''],
    antePerinatales: [''],
    padecimientoActual: [''],
    exploracionFisica: [''],
    diagnosticosProbables: [''],
  });

  constructor(
    private fb: FormBuilder
    , private router: Router
    , private activatedRoute: ActivatedRoute

    , private servicesGServ: ServicesGService
    , private _adapter: DateAdapter<any>
    , @Inject(MAT_DATE_LOCALE) private _locale: string
    , private pacientesServ: PacientesService
  ) { }

  ngOnInit(): void {
    this._locale = 'mx';
    this._adapter.setLocale(this._locale);

    if( !this.router.url.includes('editarPaciente') ){
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.pacientesServ.getPacienteByID( id ) )
      )
      .subscribe( data => {
        console.log(data)
         if(data.status == 0){
           this.id = data.data.idPaciente;

           this.catForm.setValue({
            idPaciente: data.data.idPaciente,
             name: data.data.name,
             fechaNacimiento: data.data.fechaNacimiento + 'T00:00:00'
           });


           this.fn_getHitorialClinicoByIdPaciente(this.id);
         }else{
          this.servicesGServ.showSnakbar(data.message);
         }
      } )

  }

  crearConsultaDesdePaciente( idPaciente: number ){

    localStorage.setItem('pidPaciente', idPaciente.toString());
    this.servicesGServ.changeRoute( `/${ this._appMain }/consulta` );
  }

  fn_getHitorialClinicoByIdPaciente( idPaciente: number ) {
    this.bShowSpinner = true;
      this.pacientesServ.getHitorialClinicoByIdPaciente( idPaciente )
        .subscribe({
          next: (data: ResponseGet) => {

            if( data.status === 0 ){
              this.formHistorialClinico.setValue({
                idHistClinico: data.data.rows.idHistClinico,
                idPaciente: data.data.rows.idPaciente,
                motivoConsulta: data.data.rows.motivoConsulta,
                antePersonNoPatologicos: data.data.rows.antePersonNoPatologicos,
                antePersonPatologicos: data.data.rows.antePersonPatologicos,
                antePerinatales: data.data.rows.antePerinatales,
                padecimientoActual: data.data.rows.padecimientoActual,
                exploracionFisica: data.data.rows.exploracionFisica,
                diagnosticosProbables: data.data.rows.diagnosticosProbables,
               });
            }else{
              this.servicesGServ.showAlertIA( data );
            }

            this.bShowSpinner = false;
          },
          error: (ex) => {
            this.servicesGServ.showSnakbar( "Problemas con el servicio" );
            this.bShowSpinner = false;
          }
        })
  }


  changeRoute( route: string ): void {
    this.servicesGServ.changeRoute( `/${ this._appMain }/${ route }` );
  }



  fn_savePaciente() {
    this.bShowSpinner = true;
    if(this.id > 0){
      this.pacientesServ.updatePaciente( this.catForm.value )
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
    this.pacientesServ.insertPaciente( this.catForm.value )
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

  fn_saveHistClinico() {

    this.formHistorialClinico.value.idPaciente = this.id;

    this.bShowSpinner = true;
    if( this.formHistorialClinico.value.idHistClinico > 0){
      this.pacientesServ.updateHitorialClinico( this.formHistorialClinico.value )
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
      console.log( this.formHistorialClinico.value )
    this.pacientesServ.insertHitorialClinico( this.formHistorialClinico.value )
      .subscribe({
        next: (resp: ResponseDB_CRUD) => {
          if( resp.status === 0 ){
            this.formHistorialClinico.value.idHistClinico = resp.insertID;
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

}
