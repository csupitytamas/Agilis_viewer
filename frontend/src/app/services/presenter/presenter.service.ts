import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenterService {
  private proxyUrl = '/api/v1' ;

  constructor(private http: HttpClient) {}

  getPresentations(): Observable<any> {
    return this.http.get<any>(`${this.proxyUrl}/presentation/list`);
  }

  getPresentationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.proxyUrl}/presentation/${id}`);
  }
}
