import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseDB_CRUD, ResponseGet } from 'src/app/interfaces/general.interfaces';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ServicesGService } from 'src/app/servicesG/servicesG.service';

@Component({
  selector: 'app-historial-clinico',
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.css']
})
export class HistorialClinicoComponent {

  title: string = 'Historial Clínico';
  bShowSpinner: boolean = false;

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
      private dialogRef: MatDialogRef<HistorialClinicoComponent>
      , @Inject(MAT_DIALOG_DATA) public OData: any

      , private fb: FormBuilder
      , private router: Router
      , private activatedRoute: ActivatedRoute

      , private servicesGServ: ServicesGService
      , private pacientesServ: PacientesService
    ) { }

  ngOnInit(): void {

    if( this.OData.id > 0 ){

      this.fn_getHitorialClinicoByIdPaciente(this.OData.id)

    }

  }

  close(){
    this.dialogRef.close( true );
  }

  fn_saveHistClinico() {

    this.formHistorialClinico.value.idPaciente = this.OData.id;

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

}
