import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Pagination, ResponseDB_CRUD, ResponseGet } from 'src/app/interfaces/general.interfaces';
import { PacientesService } from 'src/app/services/pacientes.service';
import { ServicesGService } from 'src/app/servicesG/servicesG.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-consulta-list',
  templateUrl: './consulta-list.component.html',
  styleUrls: ['./consulta-list.component.css']
})
export class ConsultaListComponent {

  private _appMain: string = environment.appMain;

  title = 'Lista de Consultas';
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
      this.fn_getConsultaListWithPage();
    }

    crearConsultaDesdePaciente( idPaciente: number ){

      localStorage.setItem('pidPaciente', idPaciente.toString());
      this.servicesGServ.changeRoute( `/${ this._appMain }/consulta` );
    }

    onChangeEvent(event: any){
      this.pagination.search = event.target.value;
      this.fn_getConsultaListWithPage();
    }

    changeRoute( route: string ): void {
      this.servicesGServ.changeRoute( `/${ this._appMain }/${ route }` );
    }

    edit( id: number ){
      this.servicesGServ.changeRouteWithParameter(`/${ this._appMain }/editarConsulta`, id)
    }

    changePagination(pag: Pagination) {
      this.pagination = pag;
      this.fn_getConsultaListWithPage();
    }

    fn_getConsultaListWithPage() {
      this.bShowSpinner = true;
      this.pacientesServ.getConsultaListWithPage( this.pagination )
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

    fn_deleteConsulta( id: number ){

      this.servicesGServ.showDialog('¿Estás seguro?'
                                        , 'Está a punto de borrar la consulta'
                                        , '¿Desea continuar?'
                                        , 'Si', 'No')
      .afterClosed().subscribe({
        next: ( resp ) =>{
          if(resp){
            this.bShowSpinner = true;
            this.pacientesServ.deleteConsulta(id)
            .subscribe({
              next: (resp: ResponseDB_CRUD) => {
                if( resp.status === 0 ){
                  this.fn_getConsultaListWithPage();
                }
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

}
