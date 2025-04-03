import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoadingPageComponent } from './components/loading-page/loading-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Importáljuk a MatProgressBarModule-t

import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatProgressBarModule,
    LoadingPageComponent,
    // Hozzáadjuk a MatProgressBarModule-t
  ],
  providers: []
})
export class AppModule { }
