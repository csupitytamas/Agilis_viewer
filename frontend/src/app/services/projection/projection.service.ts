import { Injectable } from '@angular/core';
import {BehaviorSubject, interval, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';
import {Slide} from '../../models/slide.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {
  private API_URL = BASE_URL.includes('localhost') ? BACKEND_API_URL : BACKEND_HOST_API_URL;
  //Fut e vetítés
  private isProjectionSubject = new BehaviorSubject<boolean>(false);
  isProjection$ = this.isProjectionSubject.asObservable();
  //Oldalszám
  private pageNumberSubject = new BehaviorSubject<number>(0);
  pageNumber$ = this.pageNumberSubject.asObservable();

  slideData: Slide = {
    id: "ed9659b5-f83f-41af-8886-75a694ea38f7",
    backgroundPath: "None",
    pageNumber: 2,
    widgets: [
      {
        id: "df40825c-a676-4ffb-9cfd-1540354fa0c2",
        positionX: 40,
        positionY: 50,
        width: 30,
        height: 20,
        type: "TextBox",
        text: "Ez csak egy próba szöveg",
        fontSize: 11
      }
    ]
  };

  constructor(private http: HttpClient) {
    this.setSlideNumber(this.slideData.pageNumber);
  }

  setProjection(value: boolean) {
    this.isProjectionSubject.next(value);
  }

  getProjection(): boolean {
    return this.isProjectionSubject.value;
  }

  setSlideNumber(value: number) {
    this.pageNumberSubject.next(value);
  }

  getSlideNumber(): number {
    return this.pageNumberSubject.value;
  }

  getSlideData(): Slide {
    return this.slideData;
  }


  startPolling(intervalMs: number) {
    /*
    interval(intervalMs)
      .pipe(switchMap(() => this.http.get<{ isRunning: boolean }>(`${this.API_URL}/status`)))
      .subscribe(response => {
        console.log('Projection status:', response.isRunning);
        this.setProjection(response.isRunning);
      });
     */
  }
}
