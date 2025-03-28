import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SLIDEMAKER_PROXY_API_URL} from '../../../environments/api-config';

@Injectable({
  providedIn: 'root'
})
export class SlidemakerService {

  private apiUrl: string =  SLIDEMAKER_PROXY_API_URL;

  constructor(private http: HttpClient) {}

  getAllPresentations(): Observable<any> {
    return this.http.get<string>(`${this.apiUrl}/presentation`, { responseType: 'text' as 'json' });
  }

  getSlideCount(): Observable<any> {
    return this.http.get<string>(`${this.apiUrl}/slide`, { responseType: 'text' as 'json' });
  }
}
