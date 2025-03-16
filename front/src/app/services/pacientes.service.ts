import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination, ResponseDB_CRUD, ResponseGet } from '../interfaces/general.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private baseURL: string = environment.baseUrl;

  _api: string = 'api/pacientes';

  constructor(
    private http: HttpClient
  ) { }

  insertPaciente( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/insertPaciente`, data );
  }

  updatePaciente( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/updatePaciente`, data );
  }

  deletePaciente( id: number ): Observable<ResponseDB_CRUD>  {
    var data = {
      idPaciente: id
    }
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/deletePaciente`, data);
  }

  getPacientesListWithPage( pagination: Pagination ): Observable<ResponseGet> {
    let start = pagination.pageIndex * pagination.pageSize;
    let limiter = pagination.pageSize;

    const data = {
      search: pagination.search
      ,start: start
      ,limiter: limiter
    };

    return this.http.post<ResponseGet>( `${ this.baseURL }/${ this._api }/getPacientesListWithPage`,data);
  }

  getPacienteByID( id: number ): Observable<ResponseGet> {
    var data = {
      idPaciente: id
    }
    return this.http.post<ResponseGet>( `${ this.baseURL }/${ this._api }/getPacienteByID`, data);
  }

  getHitorialClinicoByIdPaciente( id: number ): Observable<ResponseGet> {
    var data = {
      idPaciente: id
    }
    return this.http.post<ResponseGet>( `${ this.baseURL }/${ this._api }/getHitorialClinicoByIdPaciente`, data);
  }

  insertHitorialClinico( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/insertHitorialClinico`, data );
  }

  updateHitorialClinico( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/updateHitorialClinico`, data );
  }

  getConsultaById( id: number ): Observable<ResponseGet> {
    var data = {
      idConsulta: id
    }
    return this.http.post<ResponseGet>( `${ this.baseURL }/${ this._api }/getConsultaById`, data);
  }

  insertConsulta( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/insertConsulta`, data );
  }

  updateConsulta( data : any ): Observable<ResponseDB_CRUD> {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/updateConsulta`, data );
  }

  getConsultaListWithPage( pagination: Pagination ): Observable<ResponseGet> {
    let start = pagination.pageIndex * pagination.pageSize;
    let limiter = pagination.pageSize;

    const data = {
      search: pagination.search
      ,start: start
      ,limiter: limiter
    };

    return this.http.post<ResponseGet>( `${ this.baseURL }/${ this._api }/getConsultaListWithPage`,data);
  }

  deleteConsulta( id: number ): Observable<ResponseDB_CRUD>  {
    var data = {
      idConsulta: id
    }
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/deleteConsulta`, data);
  }

  updateFechaNacimiento( data: any ): Observable<ResponseDB_CRUD>  {
    return this.http.post<ResponseDB_CRUD>( `${ this.baseURL }/${ this._api }/updateFechaNacimiento`, data);
  }

}
