import { Component } from '@angular/core';
import {ValtoComponent} from './components/valto/valto.component';
import {NoProjectionComponent} from './components/no-projection/no-projection.component';
import {PresentationListComponent} from './components/presentation-list/presentation-list.component';
import {RouterOutlet} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageNumberComponent} from './components/page-number/page-number.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    ValtoComponent,
    NoProjectionComponent,
    PresentationListComponent,
    RouterOutlet,
    PageNumberComponent,
    MatProgressSpinner
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title(title: any) {
        throw new Error('Method not implemented.');
    }

}
