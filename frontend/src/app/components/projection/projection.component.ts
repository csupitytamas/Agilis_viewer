import { Component } from '@angular/core';
import {PageNumberComponent} from '../page-number/page-number.component';

@Component({
  selector: 'app-projection',
  imports: [
    PageNumberComponent
  ],
  templateUrl: './projection.component.html',
  standalone: true,
  styleUrl: './projection.component.css'
})
export class ProjectionComponent {

}
