import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./pages/main/main.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { PacienteComponent } from "./pages/paciente/paciente.component";
import { PacienteListComponent } from "./pages/paciente-list/paciente-list.component";
import { ConsultaComponent } from "./pages/consulta/consulta.component";
import { ConsultaListComponent } from "./pages/consulta-list/consulta-list.component";


const routes: Routes = [
    {
      path: '',
      component: MainComponent,
      children: [
        {
          path: 'dashboard',
          component: DashboardComponent
        },
        {
            path: 'paciente',
            component: PacienteComponent
        },
        {
            path: 'editarPaciente/:id',
            component: PacienteComponent
        },
        {
            path: 'pacienteList',
            component: PacienteListComponent
        },
        {
            path: 'consulta',
            component: ConsultaComponent
        },
        {
            path: 'editarConsulta/:id',
            component: ConsultaComponent
        },
        {
            path: 'consultaList',
            component: ConsultaListComponent
        },
        {
          path: '**',
          redirectTo: 'dashboard'
        }
      ]
    }
  ]

@NgModule({
    imports: [
        RouterModule.forChild( routes )
    ],
    exports: [
        RouterModule
    ]
})
export class ProtectedRoutingModule {}