import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';

export const routes: Routes = [
  { path: 'loading', component: LoadingPageComponent }, // A betöltő oldal route-ja
  //{ path: '', redirectTo: '/loading', pathMatch: 'full' } // Ha alapértelmezettnek ezt akarnénk
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
