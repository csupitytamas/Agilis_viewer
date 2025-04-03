import {Component, OnInit} from '@angular/core';
import {NoProjectionComponent} from './components/no-projection/no-projection.component';
import {PresentationListComponent} from './components/presentation-list/presentation-list.component';
import {Router, RouterOutlet} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageNumberComponent} from './components/page-number/page-number.component';
import {ProjectionService} from './services/projection/projection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NoProjectionComponent,
    PresentationListComponent,
    RouterOutlet,
    PageNumberComponent,
    MatProgressSpinner,
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private projectionService: ProjectionService
  ) {}

  ngOnInit() {
    /*
    this.projectionService.startPolling(1000);

    this.projectionService.isProjection$.subscribe(value => {
      if (value) {
        this.router.navigate(['/projection']);
      } else {
        this.router.navigate(['/no-projection']);
      }
    });
     */
  }

  title(title: any) {
    throw new Error('Method not implemented.');
  }

}
