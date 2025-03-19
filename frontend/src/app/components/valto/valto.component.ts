import { Component } from '@angular/core';

@Component({
  selector: 'app-valto',
  imports: [],
  templateUrl: './valto.component.html',
  standalone: true,
  styleUrl: './valto.component.css'
})
export class ValtoComponent {
  elso: string = "Első szöveg";
  masodik: string = "Második szöveg";
  szovegek: string[] = [this.elso, this.masodik];
  index: number = 0;

  valt(): void {
    this.index = 1 - this.index;
  }
}
