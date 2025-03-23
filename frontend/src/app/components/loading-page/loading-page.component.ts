import { Component } from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading-page',
  imports: [
    MatProgressBar
  ],
  templateUrl: './loading-page.component.html',
  standalone: true,
  styleUrl: './loading-page.component.css'
})
export class LoadingPageComponent {

}
