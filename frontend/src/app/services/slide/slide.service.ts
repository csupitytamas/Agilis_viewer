import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PRESENTER_API_URL } from '../../../environments/api-config';
import { Presentation } from '../../models/presentation.model';

@Injectable({
  providedIn: 'root',
})
export class SlideService {
  private apiUrl = PRESENTER_API_URL + '/presentation';

  constructor(private http: HttpClient) {}

  getPresentations(): Observable<{ success: boolean; presentations: Presentation[] }> {
    return this.http.get<{ success: boolean; presentations: Presentation[] }>(`${this.apiUrl}/list`);
  }

  getPresentationById(id: string): Observable<{ success: boolean; presentation: Presentation }> {
    return this.http.get<{ success: boolean; presentation: Presentation }>(`${this.apiUrl}/${id}`);
  }
}
