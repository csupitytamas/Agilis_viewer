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

  @ViewChild('slideContainer', { static: false }) slideContainer!: ElementRef; // Deklaráljuk a slideContainer-t

  // A JSON adat közvetlenül itt van, nem külső forrásból
  slideData: Slide = {
    id: "ed9659b5-f83f-41af-8886-75a694ea38f7",
    backgroundPath: "None",
    pageNumber: 2,
    widgets: [
      {
        id: "df40825c-a676-4ffb-9cfd-1540354fa0c2",
        positionX: 40,
        positionY: 50,
        width: 30,
        height: 20,
        type: "TextBox",
        text: "Ebfgddddz csak egy próba szöveg",
        fontSize: 11
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {
    // Itt nem érhető el a slideContainer
  }

  ngAfterViewInit(): void {
    this.renderSlide(); // Azonnali renderelés indítása a komponens betöltésekor
    this.adjustSlideContainer();
  }

  // Widget DOM elem létrehozása
  createWidget(widget: Widget): HTMLElement {
    const elem: HTMLElement = document.createElement("div"); // Deklaráljuk az elem-et
    elem.classList.add("widget");

    elem.style.left = `${widget.positionX}%`;
    elem.style.top = `${widget.positionY}%`;
    elem.style.width = `${widget.width}%`;
    elem.style.height = `${widget.height}%`;

    switch (widget.type) {
      case "TextBox":
        elem.classList.add("textbox");
        elem.textContent = widget.text || "";
        elem.style.fontSize = `${widget.fontSize ?? 12}pt`;
        break;
      default:
        console.warn("Ismeretlen widget típus:", widget.type);
        break;
    }

    return elem;
  }

  // Slide renderelése
  renderSlide(): void {
    if (!this.slideContainer) return; // Ellenőrizzük, hogy a slideContainer létezik-e
    const container: HTMLElement = this.slideContainer.nativeElement; // Deklaráljuk a container-t

    container.innerHTML = ""; // előző slide törlése

    if (this.slideData.backgroundPath && this.slideData.backgroundPath !== "None") {
      container.style.backgroundImage = `url(${this.slideData.backgroundPath})`;
    } else {
      container.style.backgroundImage = "";
    }

    this.slideData.widgets.forEach((widget) => {
      const elem: HTMLElement = this.createWidget(widget); // Deklaráljuk az elem-et
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
      // Az ablak túl széles
      slideHeight = windowHeight;
      slideWidth = windowHeight * aspectRatio;
    } else {
      // Az ablak túl magas
      slideWidth = windowWidth;
      slideHeight = windowWidth / aspectRatio;
    }

    container.style.width = `${slideWidth}px`;
    container.style.height = `${slideHeight}px`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.adjustSlideContainer();
  }

}
