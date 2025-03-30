import { Component } from '@angular/core';
import {ProjectionService} from '../../services/projection/projection.service';

@Component({
  selector: 'app-no-projection',
  templateUrl: './no-projection.component.html',
  standalone: true,
  styleUrls: ['./no-projection.component.css']
})
export class NoProjectionComponent {
  constructor(private projectionService: ProjectionService) {}

  start() {
    this.projectionService.setProjection(true);
  }


}
