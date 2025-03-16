import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AlertComponent } from './alert/alert.component';



@NgModule({
  declarations: [
    ConfirmComponent,
    PaginationComponent,
    SpinnerComponent,
    AlertComponent
  ],
  exports:[
    SpinnerComponent,
    PaginationComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class ComponentsModule { }
