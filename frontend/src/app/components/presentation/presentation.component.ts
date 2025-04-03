import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { SlideComponent } from "../slide/slide.component"
import { PageNumberComponent } from "../page-number/page-number.component"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {Slide} from '../../models/slide.model';
import {NoPresentationComponent} from '../no-presentation/no-presentation.component';
import {PresentationService} from '../../services/presentation/presentation.service';
import {LoadingComponent} from '../loading/loading.component';

@Component({
  selector: "app-presentation",
  standalone: true,
  imports: [CommonModule, SlideComponent, PageNumberComponent, NoPresentationComponent, MatProgressSpinnerModule, LoadingComponent],
  templateUrl: "./presentation.component.html",
  styleUrls: ["./presentation.component.css"],
})
export class PresentationComponent implements OnInit, OnDestroy {
  waitlistId: string | number = ""
  isRunning = false
  currentSlide: Slide | null = null
  loading = true
  error: string | null = null

  private runningSubscription: Subscription | null = null
  private slideDataSubscription: Subscription | null = null

  constructor(
    private route: ActivatedRoute,
    private presentationService: PresentationService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.waitlistId = params["id"]
      this.initializePresentation()
    })
  }

  initializePresentation(): void {
    this.loading = true
    this.error = null

    this.runningSubscription = this.presentationService.isRunning$.subscribe((isRunning) => {
      this.isRunning = isRunning
      this.loading = false

      if (!isRunning) {
        this.currentSlide = null
      }
    })

    this.slideDataSubscription = this.presentationService.slideData$.subscribe((slideData) => {
      this.currentSlide = slideData
    })

    this.presentationService.initializePresentation(this.waitlistId)
  }

  retryConnection(): void {
    this.initializePresentation()
  }

  ngOnDestroy(): void {
    if (this.runningSubscription) {
      this.runningSubscription.unsubscribe()
    }

    if (this.slideDataSubscription) {
      this.slideDataSubscription.unsubscribe()
    }

    this.presentationService.cleanup()
  }
}

