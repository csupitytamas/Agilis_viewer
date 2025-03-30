  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { LoadingPageComponent } from './components/loading-page/loading-page.component';
  import {ProjectionComponent} from './components/projection/projection.component';
  import {NoProjectionComponent} from './components/no-projection/no-projection.component';
  import {MainPageComponent} from './components/main-page/main-page.component';
  import {SlideComponent} from './components/slide/slide.component';

  export const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'loading', component: LoadingPageComponent },
    { path: 'projection', component: ProjectionComponent},
    { path: 'no-projection', component: NoProjectionComponent },
    { path: 'widgets', component: SlideComponent },
    { path: '**', redirectTo: '' }

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
