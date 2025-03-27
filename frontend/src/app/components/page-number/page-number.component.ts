import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-page-number',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './page-number.component.html',
  styleUrls: ['./page-number.component.css']
})
export class PageNumberComponent {
  currentPage = 1;
}

