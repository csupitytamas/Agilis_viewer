import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { PresentationService } from "../../services/presentation/presentation.service"
import { Subscription } from "rxjs"
import {NgClass, NgIf} from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDividerModule } from "@angular/material/divider"

@Component({
  selector: "app-presentation-demo",
  templateUrl: "./presentation-demo.component.html",
  standalone: true,
  imports: [NgIf, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule, NgClass],
  styleUrls: ["./presentation-demo.component.css"],
})
export class PresentationDemoComponent implements OnInit, OnDestroy {
  presentationId: string | number = ""
  isRunning = false
  loading = true
  error: string | null = null

  private runningSubscription: Subscription | null = null

  constructor(
    private route: ActivatedRoute,
    private presentationService: PresentationService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.presentationId = params["id"]
      this.checkPresentationStatus()
    })
  }

  checkPresentationStatus(): void {
    this.loading = true
    this.error = null

    this.presentationService.checkPresentationStatus(this.presentationId).subscribe({
      next: (status) => {
        this.isRunning = status.isRunning
        this.loading = false

        if (this.isRunning) {
          this.startPolling()
        }
      },
      error: (err) => {
        this.error = `Error checking presentation status: ${err.message}`
        this.loading = false
      },
    })
  }

  startPolling(): void {
    this.runningSubscription = this.presentationService.isRunning$.subscribe((isRunning) => {
      this.isRunning = isRunning
    })

    this.presentationService.startPolling(this.presentationId)
  }

  ngOnDestroy(): void {
    if (this.runningSubscription) {
      this.runningSubscription.unsubscribe()
    }

    this.presentationService.cleanup()
  }
}

