import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';
import { PageNumberComponent } from './components/page-number/page-number.component';
export const routes: Routes = [
  { path: 'loading', component: LoadingPageComponent }, // A betöltő oldal route-ja
  { path: 'projection', component: PageNumberComponent },
  //{ path: '', redirectTo: '/loading', pathMatch: 'full' } // Ha alapértelmezettnek ezt akarnénk
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
