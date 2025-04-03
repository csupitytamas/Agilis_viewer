import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, Subscription, interval, of } from "rxjs"
import { catchError, switchMap, tap, map, retry } from "rxjs/operators"
import {BACKEND_API_URL, BACKEND_HOST_API_URL, BASE_URL} from '../../../environments/api-config';
import {Slide} from '../../models/slide.model';
import {PresentationStatus} from '../../models/resentation-status.model';
import {CurrentSlide} from '../../models/current-slide.model';
import {Waitlist} from '../../models/waitlist.model';
import {WaitlistsResponse} from '../../models/waitlists-response.model';
@Injectable({
  providedIn: "root",
})
export class PresentationService {
  private API_URL = BASE_URL.includes("localhost") ? BACKEND_API_URL : BACKEND_HOST_API_URL;

  private isRunningSubject = new BehaviorSubject<boolean>(false)
  isRunning$ = this.isRunningSubject.asObservable()

  private slideNumberSubject = new BehaviorSubject<number | null>(null)
  slideNumber$ = this.slideNumberSubject.asObservable()

  private slideDataSubject = new BehaviorSubject<Slide | null>(null)
  slideData$ = this.slideDataSubject.asObservable()

  private lastCheckedSlideNumber: number | null = null

  private pollingSubscription: Subscription | null = null
  private retryCount = 3
  private retryDelay = 1000 // 1 second

  constructor(private http: HttpClient) {
    console.log("PresentationService initialized with API URL:", this.API_URL)
  }

  checkPresentationStatus(waitlistId: string | number): Observable<PresentationStatus> {
    const url = `${this.API_URL}/${waitlistId}/status`
    console.log("Checking status at:", url)

    return this.http.get<PresentationStatus>(url).pipe(
      retry({ count: this.retryCount, delay: this.retryDelay }),
      tap((status) => {
        console.log("Status response:", status)
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
    const url = `${this.API_URL}/${waitlistId}/current-slide`
    console.log("Fetching slide at:", url)

    return this.http.get<CurrentSlide>(url).pipe(
      retry({ count: this.retryCount, delay: this.retryDelay }),
      tap((slideData) => {
        console.log("Slide data response:", slideData)

        this.isRunningSubject.next(slideData.running)

        if (slideData.running && slideData.slideNumber !== null) {
          this.slideNumberSubject.next(slideData.slideNumber)

          if (slideData.slideData) {
            this.slideDataSubject.next(slideData.slideData)
            this.lastCheckedSlideNumber = slideData.slideNumber
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
    console.log(`Starting polling for waitlist ${waitlistId} every ${intervalMs}ms`)

    this.pollingSubscription = interval(intervalMs)
      .pipe(switchMap(() => this.getCurrentSlide(waitlistId)))
      .subscribe({
        next: (slideData) => {
          if (!slideData.running && this.isRunningSubject.value) {
            console.log("Presentation stopped running, stopping polling")
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
      console.log("Polling stopped")
    }
  }

  initializePresentation(waitlistId: string | number): void {
    console.log(`Initializing presentation for waitlist ${waitlistId}`)

    this.checkPresentationStatus(waitlistId).subscribe({
      next: (status) => {
        console.log(`Status check result for ${waitlistId}:`, status)

        if (status.isRunning) {
          console.log("Presentation is running, fetching current slide")

          this.getCurrentSlide(waitlistId).subscribe({
            next: (slideData) => {
              console.log("Initial slide data:", slideData)

              if (slideData.running) {
                this.startPolling(waitlistId)
              } else {
                console.log("Slide data indicates presentation is not running")
                this.isRunningSubject.next(false)
              }
            },
            error: (error) => {
              console.error("Error fetching initial slide data:", error)
              this.isRunningSubject.next(false)
            },
          })
        } else {
          console.log("Presentation is not running")
          this.isRunningSubject.next(false)
        }
      },
      error: (error) => {
        console.error("Error during initialization:", error)
        this.isRunningSubject.next(false)
      },
    })
  }

  getActiveWaitlists(): Observable<Waitlist[]> {
    const url = `${this.API_URL}/waitlists`
    console.log("Fetching active waitlists at:", url)

    return this.http.get<WaitlistsResponse>(url).pipe(
      retry({ count: this.retryCount, delay: this.retryDelay }),
      map((response) => response.waitlists),
      catchError((error) => {
        console.error("Error fetching waitlists:", error)
        return of([])
      }),
    )
  }

  getRawWaitlistData(waitlistId: string | number): Observable<any> {
    return this.http.get(`${this.API_URL}/${waitlistId}/raw`).pipe(
      catchError((error) => {
        console.error("Error fetching raw waitlist data:", error)
        return of({ success: false, error: "Failed to fetch data" })
      }),
    )
  }

  getPresentation(presentationId: string): Observable<any> {
    const url = `${this.API_URL}/presentation/${presentationId}/raw`
    console.log("Fetching presentation at:", url)

    return this.http.get(url).pipe(
      retry({ count: this.retryCount, delay: this.retryDelay }),
      catchError((error) => {
        console.error("Error fetching presentation:", error)
        return of({ success: false, error: "Failed to fetch presentation" })
      }),
    )
  }

  cleanup(): void {
    this.stopPolling()
  }
}

