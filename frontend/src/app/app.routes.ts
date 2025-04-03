  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { LoadingPageComponent } from './components/loading-page/loading-page.component';
  import {ProjectionComponent} from './components/projection/projection.component';
  import {NoProjectionComponent} from './components/no-projection/no-projection.component';
  import {SlideComponent} from './components/slide/slide.component';
  import {PresentationDemoComponent} from './components/presentation-demo/presentation-demo.component';
  import {PresentationComponent} from './components/presentation/presentation.component';

  export const routes: Routes = [
    { path: 'loading', component: LoadingPageComponent },
    { path: 'projection', component: ProjectionComponent},
    { path: 'no-projection', component: NoProjectionComponent },
    { path: ":id", component: PresentationComponent },
    { path: 'widgets', component: SlideComponent },
    { path: '**', redirectTo: '' }

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
