import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, Subscription, interval, of } from "rxjs"
import { catchError, switchMap, tap, map } from "rxjs/operators"
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';
import {Waitlist} from '../../models/waitlist.model';
import {Slide} from '../../models/slide.model';
import {CurrentSlide} from '../../models/current-slide.model';
import {PresentationStatus} from '../../models/resentation-status.model';
import {WaitlistsResponse} from '../../models/waitlists-response.model';

@Injectable({
  providedIn: "root",
})
export class PresentationService {
  private API_URL = BASE_URL.includes("localhost") ? BACKEND_API_URL : BACKEND_HOST_API_URL

  private isRunningSubject = new BehaviorSubject<boolean>(false)
  isRunning$ = this.isRunningSubject.asObservable()

  private slideNumberSubject = new BehaviorSubject<number | null>(null)
  slideNumber$ = this.slideNumberSubject.asObservable()

  private slideDataSubject = new BehaviorSubject<Slide | null>(null)
  slideData$ = this.slideDataSubject.asObservable()

  private lastCheckedSlideNumber: number | null = null

  private pollingSubscription: Subscription | null = null

  constructor(private http: HttpClient) {}

  checkPresentationStatus(waitlistId: string | number): Observable<PresentationStatus> {
    return this.http.get<PresentationStatus>(`${this.API_URL}/${waitlistId}/status`).pipe(
      tap((status) => {
        this.isRunningSubject.next(status.isRunning)
      }),
      catchError((error) => {
        console.error("Error checking presentation status:", error)
        this.isRunningSubject.next(false)
        return of({ isRunning: false })
      }),
    )
  }

  getCurrentSlide(waitlistId: string | number): Observable<CurrentSlide> {
    return this.http.get<CurrentSlide>(`${this.API_URL}/${waitlistId}/current-slide`).pipe(
      tap((slideData) => {
        this.isRunningSubject.next(slideData.running)

        if (
          slideData.running &&
          slideData.slideNumber !== null &&
          slideData.slideNumber !== this.lastCheckedSlideNumber
        ) {
          this.lastCheckedSlideNumber = slideData.slideNumber
          this.slideNumberSubject.next(slideData.slideNumber)

          if (slideData.slideData) {
            this.slideDataSubject.next(slideData.slideData)
          }
        } else if (!slideData.running) {
          this.slideNumberSubject.next(null)
          this.slideDataSubject.next(null)
          this.lastCheckedSlideNumber = null
        }
      }),
      catchError((error) => {
        console.error("Error fetching current slide:", error)
        return of({ running: false, slideNumber: null })
      }),
    )
  }

  startPolling(waitlistId: string | number, intervalMs = 2000): void {
    this.stopPolling()

    this.pollingSubscription = interval(intervalMs)
      .pipe(switchMap(() => this.getCurrentSlide(waitlistId)))
      .subscribe({
        next: (slideData) => {
          if (!slideData.running && this.isRunningSubject.value) {
            this.isRunningSubject.next(false)
            this.stopPolling()
          }
        },
        error: (error) => {
          console.error("Error during polling:", error)
        },
      })
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe()
      this.pollingSubscription = null
    }
  }

  initializePresentation(waitlistId: string | number): void {
    this.checkPresentationStatus(waitlistId).subscribe((status) => {
      if (status.isRunning) {
        this.getCurrentSlide(waitlistId).subscribe((slideData) => {
          if (slideData.running) {
            this.startPolling(waitlistId)
          }
        })
      } else {
        this.isRunningSubject.next(false)
      }
    })
  }

  getActiveWaitlists(): Observable<Waitlist[]> {
    return this.http.get<WaitlistsResponse>(`${this.API_URL}/waitlists`).pipe(
      map((response) => response.waitlists),
      catchError((error) => {
        console.error("Error fetching waitlists:", error)
        return of([])
      }),
    )
  }

  nextSlide(waitlistId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${waitlistId}/next`, {})
  }

  previousSlide(waitlistId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${waitlistId}/previous`, {})
  }

  gotoSlide(waitlistId: number, slideNumber: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${waitlistId}/goto`, { slideNumber })
  }

  cleanup(): void {
    this.stopPolling()
  }
}

