import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PRESENTER_PROXY_API_URL} from '../../../environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class PresenterService {
  private proxyUrl = PRESENTER_PROXY_API_URL ;

  constructor(private http: HttpClient) {}

  getPresentations(): Observable<any> {
    return this.http.get<any>(`${this.proxyUrl}/presentation/list`);
  }

  getPresentationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.proxyUrl}/presentation/${id}`);
  }
}
