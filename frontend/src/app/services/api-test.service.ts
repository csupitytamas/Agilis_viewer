import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private apiUrl = 'http://localhost:8080/api/test';

  constructor(private http: HttpClient) {}

  getContent(text : string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`, { params: { text } });
  }

  postContent(text : string): Observable<any> {
    return this.http.post(`${this.apiUrl}/post`, text);
  }
}
