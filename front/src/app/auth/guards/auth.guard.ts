import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanLoad, Route, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ServicesGService } from "src/app/servicesG/servicesG.service";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(
                private authServ: AuthService
                , private servicesGServ: ServicesGService
                ) {}
  
     canActivate(
       route: ActivatedRouteSnapshot,
       state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
       
        return this.authServ.validaAuth()
                  .pipe(
                    tap( bAuth => {
                      if( !bAuth ){
                        this.servicesGServ.changeRoute( './auth/login' );
                      }
                    } )
                  )
     }
    
    canLoad(
      route: Route,
      segments: UrlSegment[]): Observable<boolean> | boolean {
      
      return this.authServ.validaAuth()
                .pipe(
                  tap( bAuth => {
                    if( !bAuth ){
                        this.servicesGServ.changeRoute( './auth/login' );
                    }
                    
                  } )
                )
        
    }
  }
  