import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {PRESENTER_API_URL, PRESENTER_PROXY_API_URL} from '../../../environments/api-config';

@Injectable({
  providedIn: 'root',
})
export class SlideService {
  //private apiUrl = PRESENTER_API_URL + '/presentation';
  private proxyUrl = PRESENTER_PROXY_API_URL + '/presentation';

  constructor(private http: HttpClient) {}

  getPresentations(): Observable<any> {
    //return this.http.get<any>(`${this.apiUrl}/list`)
    return this.http.get<any>(`${this.proxyUrl}/list`);
  }

  getPresentationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.proxyUrl}/${id}`);
  }
}
