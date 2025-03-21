import { Component, OnInit } from '@angular/core';
import {Presentation} from '../../models/presentation.model';
import {SlideService} from '../../services/slide/slide.service';


@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  standalone: true,
  styleUrls: ['./presentation-list.component.css']
})
export class PresentationListComponent implements OnInit {
  presentations: Presentation[] = [];

  constructor(private slideService: SlideService) {}

  ngOnInit(): void {
    this.loadPresentations();
  }

  loadPresentations(): void {
    this.slideService.getPresentations().subscribe(response => {
        this.presentations = response.presentations;

        console.log('Megkapott presentation json:');
        console.log(this.presentations);
    });
  }
}
