import { Component, OnInit } from '@angular/core';
import {Widget} from '../../models/widget.model';
import {Slide} from '../../models/slide.model';
import {ProjectionService} from '../../services/projection/projection.service';

// Slide interfész


@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  standalone: true,
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {
  private slideData : Slide = {
    id: "",
    backgroundPath: "None",
    pageNumber: 0,
    widgets: []
  };


  constructor(private projectionService: ProjectionService) {}

  ngOnInit(): void {
    this.slideData = this.projectionService.getSlideData();
    this.renderSlide(); // Azonnali renderelés indítása a komponens betöltésekor
  }

  // Widget DOM elem létrehozása
  createWidget(widget: Widget): HTMLElement {
    const elem = document.createElement("div");
    elem.classList.add("widget");

    elem.style.marginLeft = `${widget.positionX}%`;
    elem.style.marginTop = `${widget.positionY}%`;
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
