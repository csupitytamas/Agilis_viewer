import { Component } from '@angular/core';
import {ValtoComponent} from './components/valto/valto.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    ValtoComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
