import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentationComponent } from './components/presentation/presentation.component';
import { HomeComponent } from './components/home/home.component';
import { StaticTestSlideComponent } from './components/static-test-slide/static-test-slide.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "test", component: StaticTestSlideComponent },
  { path: ":id", component: PresentationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
