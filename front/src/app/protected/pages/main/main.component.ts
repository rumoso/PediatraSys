import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Pagination } from 'src/app/interfaces/general.interfaces';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  constructor(
    private authService: AuthService
  ) { }

  get userLogin() {
    return this.authService.userLogin;
  }

  isExpanded: boolean = true;
  showSubmenu: boolean = false;
  isShowing: boolean = false;
  showSubSubMenu: boolean = false;

  MenusList: any[] = [];

  //-------------------------------
  // VARIABLES PARA LA PAGINACIÓN
  iRows: number = 0;
  pagination: Pagination = {
    search: '',
    length: 100,
    pageSize: 50,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 100]
  }
  //-------------------------------

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  

  ngOnInit(): void {
    
  }

  logout() {
    this.authService.logout();
  }
}
