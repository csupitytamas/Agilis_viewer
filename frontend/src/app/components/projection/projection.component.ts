import { Component } from '@angular/core';
import {PageNumberComponent} from '../page-number/page-number.component';
import {SlideComponent} from '../slide/slide.component';
import {ProjectionService} from '../../services/projection/projection.service';

@Component({
  selector: 'app-projection',
  imports: [
    PageNumberComponent,
    SlideComponent
  ],
  templateUrl: './projection.component.html',
  standalone: true,
  styleUrl: './projection.component.css'
})
export class ProjectionComponent {
  constructor(private projectionService: ProjectionService) {}

  stop() {
    this.projectionService.setProjection(false);
  }
}
