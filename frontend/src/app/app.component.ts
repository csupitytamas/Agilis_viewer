import {Component} from '@angular/core';
import {NoProjectionComponent} from './components/no-projection/no-projection.component';
import {PresentationListComponent} from './components/presentation-list/presentation-list.component';
import {RouterOutlet} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageNumberComponent} from './components/page-number/page-number.component';
import {MainPageComponent} from './components/main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NoProjectionComponent,
    PresentationListComponent,
    RouterOutlet,
    PageNumberComponent,
    MatProgressSpinner,
    MainPageComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  constructor() {}

  title(title: any) {
    throw new Error('Method not implemented.');
  }

}
