import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { Subscription, timer } from "rxjs"
import { SlideComponent } from "../slide/slide.component"
import { PageNumberComponent } from "../page-number/page-number.component"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatButtonModule } from "@angular/material/button"
import {NoPresentationComponent} from '../no-presentation/no-presentation.component';
import {Slide} from '../../models/slide.model';
import {PresentationService} from '../../services/presentation/presentation.service';

@Component({
  selector: "app-presentation",
  standalone: true,
  imports: [
    CommonModule,
    SlideComponent,
    PageNumberComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    NoPresentationComponent,
  ],
  templateUrl: "./presentation.component.html",
  styleUrls: ["./presentation.component.css"],
})
export class PresentationComponent implements OnInit, OnDestroy {
  waitlistId: string | number = ""
  isRunning = false
  currentSlide: Slide | null = null
  loading = true
  error: string | null = null
  retryCount = 0
  maxRetries = 3
  currentPresentationId = ""

  private runningSubscription: Subscription | null = null
  private slideDataSubscription: Subscription | null = null
  private retrySubscription: Subscription | null = null

  constructor(
    private route: ActivatedRoute,
    private presentationService: PresentationService,
  ) {}

  ngOnInit(): void {
    console.log("PresentationComponent initialized")
    this.route.params.subscribe((params) => {
      this.waitlistId = params["id"]
      console.log("Waitlist ID from route:", this.waitlistId)
      this.initializePresentation()
    })
  }

  initializePresentation(): void {
    this.loading = true
    this.error = null
    this.retryCount = 0

    if (this.runningSubscription) {
      this.runningSubscription.unsubscribe()
    }

    if (this.slideDataSubscription) {
      this.slideDataSubscription.unsubscribe()
    }

    this.runningSubscription = this.presentationService.isRunning$.subscribe((isRunning) => {
      console.log("Presentation running status:", isRunning)
      this.isRunning = isRunning
      this.loading = false

      if (!isRunning && this.retryCount < this.maxRetries) {
        this.scheduleRetry()
      }
    })

    this.slideDataSubscription = this.presentationService.slideData$.subscribe((slideData) => {
      console.log("Received slide data:", slideData)
      this.currentSlide = slideData

      this.presentationService.getRawWaitlistData(this.waitlistId).subscribe((data) => {
        if (data.success && data.waitlist && data.waitlist.presentation) {
          this.currentPresentationId = data.waitlist.presentation.id
          console.log("Current presentation ID:", this.currentPresentationId)
        }
      })

      if (slideData) {
        this.retryCount = 0
        this.cancelRetry()
      }
    })

    this.presentationService.initializePresentation(this.waitlistId)
  }

  scheduleRetry(): void {
    this.cancelRetry()

    console.log(`Scheduling retry ${this.retryCount + 1} of ${this.maxRetries}`)
    this.retrySubscription = timer(3000).subscribe(() => {
      this.retryCount++
      console.log(`Retrying (${this.retryCount}/${this.maxRetries})...`)
      this.presentationService.initializePresentation(this.waitlistId)
    })
  }

  cancelRetry(): void {
    if (this.retrySubscription) {
      this.retrySubscription.unsubscribe()
      this.retrySubscription = null
    }
  }

  retryConnection(): void {
    this.retryCount = 0
    this.initializePresentation()
  }

  ngOnDestroy(): void {
    this.cancelRetry()

    if (this.runningSubscription) {
      this.runningSubscription.unsubscribe()
    }

    if (this.slideDataSubscription) {
      this.slideDataSubscription.unsubscribe()
    }

    this.presentationService.cleanup()
  }
}

