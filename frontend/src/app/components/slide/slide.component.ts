import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import {Slide} from '../../models/slide.model';
import {Widget} from '../../models/widget.model';

@Component({
  selector: "app-slide",
  templateUrl: "./slide.component.html",
  standalone: true,
  imports: [CommonModule],
  styleUrls: ["./slide.component.css"],
})
export class SlideComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild("slideContainer", { static: false }) slideContainer!: ElementRef

  @Input() slideData: Slide | null = null

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderSlide()
    this.adjustSlideContainer()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["slideData"] && this.slideContainer) {
      this.renderSlide()
    }
  }

  calculateFontSize(widgetFontSize: number, containerWidth: number): number {
    const baseWidth = 1920
    return ((widgetFontSize * containerWidth) / baseWidth) * 1.5
  }

  createWidget(widget: Widget): HTMLElement {
    const elem: HTMLElement = document.createElement("div")
    elem.classList.add("widget")

    //Pozíciók
    elem.style.position = "absolute"
    elem.style.left = `${widget.positionX}%`
    elem.style.top = `${widget.positionY}%`
    elem.style.width = `${widget.width}%`
    elem.style.height = `${widget.height}%`

    if (widget.type === "TextBox") {
      elem.classList.add("textbox")
      elem.textContent = widget.text || ""

      // Betűméret
      const containerWidth = this.slideContainer.nativeElement.clientWidth
      elem.style.fontSize = `${this.calculateFontSize(widget.fontSize ?? 12, containerWidth)}px`

      // Stílus
      if (widget.bold) {
        elem.style.fontWeight = "bold"
      }
      if (widget.italic) {
        elem.style.fontStyle = "italic"
      }
      if (widget.textDecoration) {
        elem.style.textDecoration = widget.textDecoration
      }
    }

    return elem
  }


  renderSlide(): void {
    if (!this.slideContainer || !this.slideData) return
    const container: HTMLElement = this.slideContainer.nativeElement

    container.innerHTML = ""
    if (this.slideData.backgroundPath !== "None") {
      container.style.backgroundImage = `url(${this.slideData.backgroundPath})`
    }

    this.slideData.widgets.forEach((widget: Widget) => {
      const elem: HTMLElement = this.createWidget(widget)
      container.appendChild(elem)
    })
  }

  adjustSlideContainer(): void {
    if (!this.slideContainer) return
    const container: HTMLElement = this.slideContainer.nativeElement

    const windowWidth: number = window.innerWidth
    const windowHeight: number = window.innerHeight
    const aspectRatio: number = 16 / 9

    let slideWidth: number, slideHeight: number

    if (windowWidth / windowHeight > aspectRatio) {
      slideHeight = windowHeight
      slideWidth = windowHeight * aspectRatio
    } else {
      slideWidth = windowWidth
      slideHeight = windowWidth / aspectRatio
    }

    container.style.width = `${slideWidth}px`
    container.style.height = `${slideHeight}px`

    this.renderSlide()
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.adjustSlideContainer()
  }

  isFullscreen = false

  toggleFullscreen(): void {
    const blackBars = document.querySelector(".black-bars") as HTMLElement

    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          blackBars.style.backgroundColor = "black"
          this.isFullscreen = true
        })
        .catch((err: { message: any }) => {
          console.error(`Fullscreen error: ${err.message}`)
        })
    } else {
      document.exitFullscreen()
      this.isFullscreen = false
    }
  }

  @HostListener("document:fullscreenchange", [])
  onFullscreenChange(): void {
    const blackBars = document.querySelector(".black-bars") as HTMLElement
    if (!document.fullscreenElement) {
      blackBars.style.backgroundColor = "#aaa"
    }
  }
}

