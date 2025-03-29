import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProjectionService} from '../../services/projection/projection.service';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  constructor(private router: Router, private projectionService: ProjectionService) {}

  ngOnInit() {
    this.projectionService.startPolling(1000);

    this.projectionService.isProjection$.subscribe(value => {
      if (value) {
        this.router.navigate(['/projection']);
      } else {
        this.router.navigate(['/no-projection']);
      }
    });
  }
}
