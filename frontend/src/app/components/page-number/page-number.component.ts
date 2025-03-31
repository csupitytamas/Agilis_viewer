import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {HttpClient} from '@angular/common/http';
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';
import {interval, switchMap} from 'rxjs';
import {ProjectionService} from '../../services/projection/projection.service';


@Component({
  selector: 'app-page-number',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './page-number.component.html',
  styleUrls: ['./page-number.component.css']
})
export class PageNumberComponent implements OnInit, OnDestroy{
  currentPage: number = 0;
  private pollingSubscription: any;
  private readonly API_URL = BASE_URL.includes('localhost') ? BACKEND_API_URL : BACKEND_HOST_API_URL;

  constructor(
    private http: HttpClient,
    private projectionService: ProjectionService
  ) {}

  ngOnInit(): void {
    this.projectionService.pageNumber$.subscribe((pageNumber) => {
      this.currentPage = pageNumber;
    });
    /*
    this.startPolling(1000);
     */
  }

  ngOnDestroy(): void {
    /*
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
     */
  }

  /*
  startPolling(intervalMs: number): void {
    this.pollingSubscription = interval(intervalMs)
      .pipe(
        switchMap(() => this.http.get<{ currentSlide: number }>(`${this.API_URL}/current-slide`))
      )
      .subscribe(
        (response) => {
          if (response.currentSlide !== this.currentPage) {
            this.currentPage = response.currentSlide;
            console.log('Updated slide:', this.currentPage);
          }
        },
        (error) => {
          console.error('Error fetching current slide:', error);
        }
      );
  }
   */
}

