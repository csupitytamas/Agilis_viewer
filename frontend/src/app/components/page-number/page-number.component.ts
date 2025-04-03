import { Component, type OnDestroy, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { Subscription } from "rxjs"
import { PresentationService } from "../../services/presentation/presentation.service"

@Component({
  selector: "app-page-number",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./page-number.component.html",
  styleUrls: ["./page-number.component.css"],
})
export class PageNumberComponent implements OnInit, OnDestroy {
  currentPage = 0
  private pageNumberSubscription: Subscription | null = null

  constructor(private presentationService: PresentationService) {}

  ngOnInit(): void {
    this.pageNumberSubscription = this.presentationService.slideNumber$.subscribe((slideNumber) => {
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

