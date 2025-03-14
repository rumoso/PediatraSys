import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Pagination, ResponseDB_CRUD, ResponseGet } from 'src/app/interfaces/general.interfaces';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ServicesGService } from 'src/app/servicesG/servicesG.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paciente-list',
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.css']
})
export class PacienteListComponent implements OnInit {

  private _appMain: string = environment.appMain;

  title = 'Lista de pacientes';
  bShowSpinner: boolean = false;
  list: any[] = [];

  //-------------------------------
  // VARIABLES PARA LA PAGINACIÓN
  iRows: number = 0;
  pagination: Pagination = {
    search:'',
    length: 10,
    pageSize: 10,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 100]
  }
  //-------------------------------

  constructor(
    private pacientesServ: PacientesService
    , private servicesGServ: ServicesGService
    ) { }

    ngOnInit(): void {
      localStorage.setItem('pidPaciente', '');
      this.fn_getPacientesListWithPage();
    }

    onChangeEvent(event: any){
      this.pagination.search = event.target.value;
      this.fn_getPacientesListWithPage();
    }

    changeRoute( route: string ): void {
      this.servicesGServ.changeRoute( `/${ this._appMain }/${ route }` );
    }

    crearConsultaDesdePaciente( idPaciente: number ){

      localStorage.setItem('pidPaciente', idPaciente.toString());
      this.servicesGServ.changeRoute( `/${ this._appMain }/consulta` );
    }

    edit( id: number ){
      this.servicesGServ.changeRouteWithParameter(`/${ this._appMain }/editarPaciente`, id)
    }
  
    changePagination(pag: Pagination) {
      this.pagination = pag;
      this.fn_getPacientesListWithPage();
    }
  
    fn_getPacientesListWithPage() {
      this.bShowSpinner = true;
      this.pacientesServ.getPacientesListWithPage( this.pagination )
      .subscribe({
        next: (resp: ResponseGet) => {
          console.log(resp)
          this.list = resp.data.rows;
          this.pagination.length = resp.data.count;
          this.bShowSpinner = false;
        },
        error: (ex: HttpErrorResponse) => {
          console.log( ex.error.errors[0].msg )
          this.servicesGServ.showSnakbar( ex.error.errors[0].msg );
          this.bShowSpinner = false;
        }
      })
    }

    fn_deletePaciente( id: number ){

      this.servicesGServ.showDialog('¿Estás seguro?'
                                        , 'Está a punto de borrar al paciente'
                                        , '¿Desea continuar?'
                                        , 'Si', 'No')
      .afterClosed().subscribe({
        next: ( resp ) =>{
          if(resp){
            this.bShowSpinner = true;
            this.pacientesServ.deletePaciente(id)
            .subscribe({
              next: (resp: ResponseDB_CRUD) => {
                if( resp.status === 0 ){
                  this.fn_getPacientesListWithPage();
                }
                this.servicesGServ.showSnakbar(resp.message);
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
}
