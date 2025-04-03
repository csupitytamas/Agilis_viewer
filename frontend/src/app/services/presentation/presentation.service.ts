import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http" // Changed from import type
import { BehaviorSubject, type Observable, type Subscription, interval, of } from "rxjs"
import { catchError, switchMap, tap, map } from "rxjs/operators"
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';
import {Slide} from '../../models/slide.model';

export interface PresentationStatus {
  isRunning: boolean
}

export interface CurrentSlide {
  running: boolean
  slideNumber: number | null
  slideData?: any
}

@Injectable({
  providedIn: "root",
})
export class PresentationService {
  private API_URL = BASE_URL.includes('localhost') ? BACKEND_API_URL : BACKEND_HOST_API_URL;

  private isRunningSubject = new BehaviorSubject<boolean>(false)
  isRunning$ = this.isRunningSubject.asObservable()

  private slideNumberSubject = new BehaviorSubject<number | null>(null)
  slideNumber$ = this.slideNumberSubject.asObservable()

  private slideDataSubject = new BehaviorSubject<Slide | null>(null)
  slideData$ = this.slideDataSubject.asObservable()

  private lastCheckedSlideNumber: number | null = null

  private pollingSubscription: Subscription | null = null

  constructor(private http: HttpClient) {}

  checkPresentationStatus(presentationId: string | number): Observable<PresentationStatus> {
    return this.http.get<PresentationStatus>(`${this.API_URL}/${presentationId}/status`).pipe(
      tap((status) => {
        console.log(`Presentation ${presentationId} status:`, status)
        this.isRunningSubject.next(status.isRunning)
      }),
      catchError((error) => {
        console.error("Error checking presentation status:", error)
        this.isRunningSubject.next(false)
        return of({ isRunning: false })
      }),
    )
  }

  getCurrentSlide(presentationId: string | number): Observable<CurrentSlide> {
    return this.http.get<CurrentSlide>(`${this.API_URL}/${presentationId}/current-slide`).pipe(
      tap((slideData) => {
        console.log("Current slide data:", slideData)

        this.isRunningSubject.next(slideData.running)

        if (
          slideData.running &&
          slideData.slideNumber !== null &&
          slideData.slideNumber !== this.lastCheckedSlideNumber
        ) {
          console.log(`Slide changed: ${this.lastCheckedSlideNumber} -> ${slideData.slideNumber}`)

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

  startPolling(presentationId: string | number, intervalMs = 2000): void {
    this.stopPolling()

    console.log(`Starting polling for presentation ${presentationId}`)

    this.pollingSubscription = interval(intervalMs)
      .pipe(switchMap(() => this.getCurrentSlide(presentationId)))
      .subscribe({
        next: (slideData) => {
          if (!slideData.running && this.isRunningSubject.value) {
            console.log(`Presentation ${presentationId} is no longer running`)
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
      console.log("Stopped polling")
    }
  }

  initializePresentation(presentationId: string | number): void {
    this.checkPresentationStatus(presentationId).subscribe((status) => {
      if (status.isRunning) {
        this.getCurrentSlide(presentationId).subscribe((slideData) => {
          if (slideData.running) {
            this.startPolling(presentationId)
          }
        })
      } else {
        console.log(`Presentation ${presentationId} is not running`)
        this.isRunningSubject.next(false)
      }
    })
  }

  checkForNewSlide(presentationId: string | number): Observable<boolean> {
    return this.getCurrentSlide(presentationId).pipe(
      map((slideData) => {
        if (!slideData.running || slideData.slideNumber === null) {
          return false
        }

        if (this.lastCheckedSlideNumber === null) {
          return true
        }

        return slideData.slideNumber !== this.lastCheckedSlideNumber
      }),
    )
  }

  getCurrentSlideNumber(): number | null {
    return this.slideNumberSubject.value
  }

  getCurrentSlideData(): Slide | null {
    return this.slideDataSubject.value
  }

  cleanup(): void {
    this.stopPolling()
  }
}

