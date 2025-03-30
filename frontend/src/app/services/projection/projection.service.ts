import { Injectable } from '@angular/core';
import {BehaviorSubject, interval, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {
  private isProjectionSubject = new BehaviorSubject<boolean>(false);
  isProjection$ = this.isProjectionSubject.asObservable();
  private API_URL = BASE_URL.includes('localhost') ? BACKEND_API_URL : BACKEND_HOST_API_URL;

  constructor(private http: HttpClient) {}

  setProjection(value: boolean) {
    this.isProjectionSubject.next(value);
  }

  getProjection(): boolean {
    return this.isProjectionSubject.value;
  }

  startPolling(intervalMs: number) {
    interval(intervalMs)
      .pipe(switchMap(() => this.http.get<{ isRunning: boolean }>(`${this.API_URL}/status`)))
      .subscribe(response => {
        console.log('Projection status:', response.isRunning);
        this.setProjection(response.isRunning);
      });
  }
}
