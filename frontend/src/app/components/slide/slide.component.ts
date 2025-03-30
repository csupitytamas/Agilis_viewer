import { Component, OnInit } from '@angular/core';

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
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

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
        text: "Ez csak egy próba szöveg",
        fontSize: 11
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {
    this.renderSlide(); // Azonnali renderelés indítása a komponens betöltésekor
  }

  // Widget DOM elem létrehozása
  createWidget(widget: Widget): HTMLElement {
    const elem = document.createElement("div");
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
    const container = document.getElementById("slide");
    if (!container) return;

    container.innerHTML = ""; // előző slide törlése

    if (this.slideData.backgroundPath && this.slideData.backgroundPath !== "None") {
      container.style.backgroundImage = `url(${this.slideData.backgroundPath})`;
    } else {
      container.style.backgroundImage = "";
    }

    this.slideData.widgets.forEach((widget) => {
      const elem = this.createWidget(widget);
      container.appendChild(elem);
    });
  }
}
