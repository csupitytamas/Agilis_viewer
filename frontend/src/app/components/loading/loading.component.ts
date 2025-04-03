import { Component } from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading',
  imports: [
    MatProgressBar
  ],
  templateUrl: './loading.component.html',
  standalone: true,
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

}
