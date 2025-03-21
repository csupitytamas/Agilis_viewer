import { Component, OnInit } from '@angular/core';
import {Presentation} from '../../models/presentation.model';
import {SlideService} from '../../services/slide/slide.service';
import {PresenterService} from '../../services/presenter/presenter.service';
import {SlidemakerService} from '../../services/slidemaker/slidemaker.service';


@Component({
  selector: 'app-presentation-list',
  templateUrl: './presentation-list.component.html',
  standalone: true,
  styleUrls: ['./presentation-list.component.css']
})
export class PresentationListComponent implements OnInit {
  presenterPresentations: Presentation[] = [];
  //slidemakerPresentations: Presentation[] = [];
  slidemakerPresentations : string = '';
  slidemakerSlide: string = '';

  constructor(private presenterService : PresenterService, private slidemakerService: SlidemakerService) {}

  ngOnInit(): void {
    this.loadPresentations();
  }

  loadPresentations(): void {
    //Prezentációk betöltése a vezerlőtől
    this.presenterService.getPresentations().subscribe(response => {
        this.presenterPresentations = response.presentations;

        console.log('Megkapott presenter presentation json:');
        console.log(this.presenterPresentations);
    });

    //Prezentációk betöltése a szerkesztőtől
    this.slidemakerService.getAllPresentations().subscribe(response => {
        this.slidemakerPresentations = response;

        console.log('Megkapott slidemaker presentation json:');
        console.log(this.slidemakerPresentations);
    });

    //Slide count lekérdezése a szerkesztőtől
    this.slidemakerService.getSlideCount().subscribe(response => {
        this.slidemakerSlide = response;

        console.log('Megkapott slidecount json:');
        console.log(this.slidemakerSlide);
    });
  }
}
