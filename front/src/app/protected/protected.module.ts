import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main/main.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { PacienteListComponent } from './pages/paciente-list/paciente-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ProtectedRoutingModule } from './protected-routing.module';
import { ComponentsModule } from '../components/components.module';
import { ConsultaComponent } from './pages/consulta/consulta.component';
import { ConsultaListComponent } from './pages/consulta-list/consulta-list.component';
import { HistorialClinicoComponent } from './pages/mdl/historial-clinico/historial-clinico.component';



@NgModule({
  declarations: [
    MainComponent,
    PacienteComponent,
    PacienteListComponent,
    DashboardComponent,
    ConsultaComponent,
    ConsultaListComponent,
    HistorialClinicoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ProtectedRoutingModule,
    ComponentsModule
  ]
})
export class ProtectedModule { }
