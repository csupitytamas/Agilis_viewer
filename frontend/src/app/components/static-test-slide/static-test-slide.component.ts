import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Slide } from "../../models/slide.model";
import { Widget } from "../../models/widget.model";

@Component({
  selector: "app-static-test-slide",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./static-test-slide.component.html",
  styleUrls: ["./static-test-slide.component.css"],
})
export class StaticTestSlideComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChild("slideContainer", { static: false }) slideContainer!: ElementRef;

  slideData: Slide = {
    id: "1d4c425f-e5a6-4b94-9ba7-c26355c98ab7",
    pageNumber: 1,
    widgets: [],
    animation: "fade"
  };

  slideData2: Slide = {
    id: "1d46425f-e5a6-4b94-9ba7-c26355c98ab7",
    pageNumber: 2,
    widgets: [],
    animation: "fade"
  };

  // Slide 1: staticWidgets
  staticWidgets: Widget[] = [
    {
      id: "w0",
      positionX: 5,
      positionY: 5,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "Aláhúzott",
      fontSize: 60,
      bold: false,
      italic: false,
      textDecoration: "underline",
    },
    {
      id: "w1",
      positionX: 5,
      positionY: 25,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "Áthúzott",
      fontSize: 25,
      bold: false,
      italic: false,
      textDecoration: "line-through",
    },
    {
      id: "w2",
      positionX: 30,
      positionY: 5,
      width: 30,
      height: 12,
      type: "TextBox",
      text: "Alapértelmezett",
      fontSize: 50,
      bold: false,
      italic: false,
    },
    {
      id: "w3",
      positionX: 50,
      positionY: 50,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "Minden egybe",
      fontSize: 25,
      bold: true,
      italic: true,
      textDecoration: "line-through",
    },
    {
      id: "w4",
      positionX: 40,
      positionY: 80,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "Dőlt",
      fontSize: 125,
      bold: false,
      italic: true,
    },
  ];

  // Slide 2: staticWidgets2
  staticWidgets2: Widget[] = [
    {
      id: "w0",
      positionX: 5,
      positionY: 5,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "Ja ja aha",
      fontSize: 40,
      bold: true,
      italic: false,
      textDecoration: "underline",
    },
    {
      id: "w1",
      positionX: 5,
      positionY: 25,
      width: 28,
      height: 12,
      type: "TextBox",
      text: "hapculákoscudarvilág",
      fontSize: 30,
      bold: true,
      italic: true,
      textDecoration: "line-through",
    },
    {
      id: "w2",
      positionX: 30,
      positionY: 5,
      width: 30,
      height: 12,
      type: "TextBox",
      text: "Defaszöveg",
      fontSize: 40,
      bold: false,
      italic: false,
    },
    {
      id: "w3",
      positionX: 20,
      positionY: 60,
      width: 100,
      height: 12,
      type: "TextBox",
      text: "Chicken Jockey!🐔🧟",
      fontSize: 100,
      bold: true,
      italic: false,
    },
  ];

  currentWidgets: Widget[] = this.staticWidgets;
  currentSlide: Slide = this.slideData;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderSlide();
    this.adjustSlideContainer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["slideData"] && this.slideContainer) {
      this.renderSlide();
    }
  }

  toggleWidgets(): void {
    const slideContainer = this.slideContainer.nativeElement;
    const widgetsContainer = slideContainer.querySelector(".widgets-container") as HTMLElement;

    // Előző animáció eltávolítása
    widgetsContainer.classList.remove("fade-in", "fade-out");

    // Ha van animáció a következő dia adatában
    if (this.currentSlide?.animation === "fade") {
      // Először fade-out animációt alkalmazunk
      widgetsContainer.classList.add("fade-out");

      // Várjunk 1 másodpercet, amíg a fade-out animáció befejeződik
      setTimeout(() => {
        // Két dia közötti váltás
        this.currentWidgets =
          this.currentWidgets === this.staticWidgets
            ? this.staticWidgets2
            : this.staticWidgets;

        this.currentSlide =
          this.currentSlide === this.slideData ? this.slideData2 : this.slideData;

        widgetsContainer.classList.remove("fade-out");
        this.renderSlide(); // Rendereljük újra a diát

        // Fade-in animáció hozzáadása
        widgetsContainer.classList.add("fade-in");
      }, 500); // A fade-out animáció ideje
    } else {
      // Ha nincs animáció, közvetlen váltás a widgetek között
      this.currentWidgets =
        this.currentWidgets === this.staticWidgets
          ? this.staticWidgets2
          : this.staticWidgets;
      this.currentSlide =
        this.currentSlide === this.slideData ? this.slideData2 : this.slideData;
      this.renderSlide(); // Rendereljük újra a diát
    }
  }


  calculateFontSize(widgetFontSize: number, containerWidth: number): number {
    const baseWidth = 1920;
    return ((widgetFontSize * containerWidth) / baseWidth) * 1.5;
  }

  createWidget(widget: Widget): HTMLElement {
    const elem: HTMLElement = document.createElement("div");
    elem.classList.add("widget");

    // Pozíciók
    elem.style.position = "absolute";
    elem.style.left = `${widget.positionX}%`;
    elem.style.top = `${widget.positionY}%`;
    elem.style.width = `${widget.width}%`;
    elem.style.height = `${widget.height}%`;

    if (widget.type === "TextBox") {
      elem.classList.add("textbox");
      elem.textContent = widget.text || "";

      // Betűméret
      const containerWidth = this.slideContainer.nativeElement.clientWidth;
      elem.style.fontSize = `${this.calculateFontSize(widget.fontSize ?? 12, containerWidth)}px`;

      // Stílusok
      if (widget.bold) {
        elem.style.fontWeight = "bold";
      }
      if (widget.italic) {
        elem.style.fontStyle = "italic";
      }
      if (widget.textDecoration) {
        elem.style.textDecoration = widget.textDecoration;
      }
    }

    return elem;
  }

  renderSlide(): void {
    if (!this.slideContainer || !this.currentWidgets) return;
    const container: HTMLElement = this.slideContainer.nativeElement;

    // Rendereljük a háttér elemet először
    let background = container.querySelector(".slide-background") as HTMLElement;
    if (!background) {
      background = document.createElement("div");
      background.classList.add("slide-background");
      container.appendChild(background);
    }

    // Widgetek konténerének előkészítése
    let widgetsContainer = container.querySelector(".widgets-container") as HTMLElement;
    if (!widgetsContainer) {
      widgetsContainer = document.createElement("div");
      widgetsContainer.classList.add("widgets-container");
      container.appendChild(widgetsContainer);
    }

    // Előző widgetek eltávolítása
    widgetsContainer.innerHTML = "";

    // Widgetek hozzáadása a widgetsContainer-be
    this.currentWidgets.forEach((widget: Widget) => {
      const elem: HTMLElement = this.createWidget(widget);
      widgetsContainer.appendChild(elem);
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

    this.renderSlide();
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.adjustSlideContainer();
  }

  isFullscreen = false;

  toggleFullscreen(): void {
    const blackBars = document.querySelector(".black-bars") as HTMLElement;

    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          blackBars.style.backgroundColor = "black";
          this.isFullscreen = true;
        })
        .catch((err: { message: any }) => {
          console.error(`Fullscreen error: ${err.message}`);
        });
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  @HostListener("document:fullscreenchange", [])
  onFullscreenChange(): void {
    const blackBars = document.querySelector(".black-bars") as HTMLElement;
    if (!document.fullscreenElement) {
      blackBars.style.backgroundColor = "#aaa";
    }
  }
}
