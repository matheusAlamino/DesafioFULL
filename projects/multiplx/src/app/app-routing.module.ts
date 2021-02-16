import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: 'usuarios',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
