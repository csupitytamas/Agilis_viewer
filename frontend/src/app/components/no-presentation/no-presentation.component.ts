import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-presentation',
  imports: [],
  templateUrl: './no-presentation.component.html',
  standalone: true,
  styleUrls: ['./no-presentation.component.css']
})
export class NoPresentationComponent implements OnInit {

  ngOnInit(): void {
    this.exitFullscreen();
  }

  // Kilépés a fullscreen módból
  private exitFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen mode:", err);
      });
    }
  }
}
