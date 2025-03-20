import { Component } from '@angular/core';
import {ValtoComponent} from './components/valto/valto.component';
import {NoProjectionComponent} from './components/no-projection/no-projection.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    ValtoComponent,
    NoProjectionComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
