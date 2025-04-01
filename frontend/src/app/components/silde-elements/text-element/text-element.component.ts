import { Component, Input, OnInit } from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-text-element',
  templateUrl: './text-element.component.html',
  imports: [
    NgStyle
  ],
  styleUrls: ['./text-element.component.css']
})
export class TextElementComponent implements OnInit {
  @Input() widget: any;
  @Input() containerWidth: number = 1920; // fallback default érték

  fontSizePx: string = '12px';

  ngOnInit(): void {
    const calculated = this.calculateFontSize(this.widget?.fontSize ?? 12, this.containerWidth);
    this.fontSizePx = `${calculated}px`;
  }

  calculateFontSize(widgetFontSize: number, containerWidth: number): number {
    const baseWidth = 1920;
    return (widgetFontSize * containerWidth) / baseWidth * 1.5;
  }
}
