import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';
import {ProjectionComponent} from './components/projection/projection.component';
import {NoProjectionComponent} from './components/no-projection/no-projection.component';
export const routes: Routes = [
  { path: 'loading', component: LoadingPageComponent },// A betöltő oldal route-ja
  {path: 'projection', component: ProjectionComponent},
  { path: 'no-projection', component: NoProjectionComponent },
  //{ path: '', redirectTo: '/loading', pathMatch: 'full' } // Ha alapértelmezettnek ezt akarnénk
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
