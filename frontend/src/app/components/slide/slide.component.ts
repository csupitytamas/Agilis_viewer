import {Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener} from '@angular/core';

// Widget interfész
interface Widget {
  id: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  type: string;
  text?: string;
  fontSize?: number;
}

// Slide interfész
interface Slide {
  id: string;
  backgroundPath: string;
  pageNumber: number;
  widgets: Widget[];
}

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  standalone: true,
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit, AfterViewInit {

  @ViewChild('slideContainer', { static: false }) slideContainer!: ElementRef;

  slideData: Slide = {
    id: "ed9659b5-f83f-41af-8886-75a694ea38f7",
    backgroundPath: "None",
    pageNumber: 2,
    widgets: [
      {
        id: "df40825c-a676-4ffb-9cfd-1540354fa0c2",
        positionX: 40,
        positionY: 50,
        width: 10,
        height: 10,
        type: "TextBox",
        text: "Ez egy próba szöveg",
        fontSize: 11,
      },
      {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        positionX: 10,
        positionY: 20,
        width: 40,
        height: 25,
        type: "TextBox",
        text: "Kiemelt szöveg",
        fontSize: 18,
      },
      {
        id: "c3d4e5f6-7890-1234-cdef-34567890abcd",
        positionX: 50,
        positionY: 85,
        width: 50,
        height: 30,
        type: "TextBox",
        text: "Nagy méretű szöveg",
        fontSize: 24,
      },
      {
        id: "b2c3d4e5-f678-9012-bcde-f234567890ab",
        positionX: 60,
        positionY: 70,
        width: 20,
        height: 15,
        type: "TextBox",
        text: "Dőlt betűs szöveg",
        fontSize: 14,
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderSlide();
    this.adjustSlideContainer();
  }

  calculateFontSize(widgetFontSize: number, containerWidth: number): number {
    const baseWidth = 1920; // Alap szélesség
    return (widgetFontSize * containerWidth) / baseWidth *1.5;
  }

  createWidget(widget: Widget): HTMLElement {
    const elem: HTMLElement = document.createElement("div");
    elem.classList.add("widget");

    elem.style.position = "absolute";
    elem.style.left = `${widget.positionX}%`;
    elem.style.top = `${widget.positionY}%`;
    elem.style.width = `${widget.width}%`;
    elem.style.height = `${widget.height}%`;

    if (widget.type === "TextBox") {
      elem.classList.add("textbox");
      elem.textContent = widget.text || "";
      const containerWidth = this.slideContainer.nativeElement.clientWidth;
      elem.style.fontSize = `${this.calculateFontSize(widget.fontSize ?? 12, containerWidth)}px`;
    }

    return elem;
  }

  renderSlide(): void {
    if (!this.slideContainer) return;
    const container: HTMLElement = this.slideContainer.nativeElement;

    container.innerHTML = "";
    if (this.slideData.backgroundPath !== "None") {
      container.style.backgroundImage = `url(${this.slideData.backgroundPath})`;
    }

    this.slideData.widgets.forEach((widget) => {
      const elem: HTMLElement = this.createWidget(widget);
      container.appendChild(elem);
    });
  }

  adjustSlideContainer(): void {
    if (!this.slideContainer) return;
    const container: HTMLElement = this.slideContainer.nativeElement;

    const windowWidth: number = window.innerWidth;
    const windowHeight: number = window.innerHeight;
    const aspectRatio: number = 16 / 9;

    let slideWidth: number, slideHeight: number;

    if (windowWidth / windowHeight > aspectRatio) {
      slideHeight = windowHeight;
      slideWidth = windowHeight * aspectRatio;
    } else {
      slideWidth = windowWidth;
      slideHeight = windowWidth / aspectRatio;
    }

    container.style.width = `${slideWidth}px`;
    container.style.height = `${slideHeight}px`;

    // Újraszámoljuk a betűméretet
    this.renderSlide();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.adjustSlideContainer();
  }

  isFullscreen = false;

  toggleFullscreen(): void {
    const blackBars = document.querySelector('.black-bars') as HTMLElement;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        blackBars.style.backgroundColor = "black";
        this.isFullscreen = true;
      }).catch((err: { message: any; }) => {
        console.error(`Fullscreen hiba: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  @HostListener('document:fullscreenchange', [])
  onFullscreenChange(): void {
    const blackBars = document.querySelector('.black-bars') as HTMLElement;
    if (!document.fullscreenElement) {
      blackBars.style.backgroundColor = "#aaa";
    }
  }


}
