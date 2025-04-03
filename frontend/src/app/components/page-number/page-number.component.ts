import { Component, type OnDestroy, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { Subscription } from "rxjs"
import { PresentationService } from "../../services/presentation/presentation.service"

@Component({
  selector: "app-page-number",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="slide-indicator">
      <mat-icon class="slide-icon">slideshow</mat-icon>
      <span> {{ currentPage }} </span>
    </div>
  `,
  styles: [
    `
      .slide-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgb(255, 255, 255);
        color: #000000;
        padding: 20px 26px;
        border: 2px solid #ccc;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 16px;
        box-shadow: 0 3px 30px rgb(255, 255, 255);
        z-index: 1000;
      }

      .slide-icon {
        font-size: 25px;
        color: #ffc107;
      }

      .slide-icon {
        font-size: 25px;
        color: #ffc107;
      }
  `,
  ],
})
export class PageNumberComponent implements OnInit, OnDestroy {
  currentPage = 0
  private pageNumberSubscription: Subscription | null = null

  constructor(private presentationService: PresentationService) {}

  ngOnInit(): void {
    console.log("PageNumberComponent initialized")
    this.pageNumberSubscription = this.presentationService.slideNumber$.subscribe((slideNumber) => {
      console.log("Received slide number update:", slideNumber)
      if (slideNumber !== null) {
        this.currentPage = slideNumber
      } else {
        this.currentPage = 0
      }
    })
  }

  ngOnDestroy(): void {
    if (this.pageNumberSubscription) {
      this.pageNumberSubscription.unsubscribe()
    }
  }
}

