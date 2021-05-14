import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./titles/titles.module').then(m => m.TitlesModule)
    },
    {
        path: '**',
        loadChildren: () => import('./titles/titles.module').then(m => m.TitlesModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
