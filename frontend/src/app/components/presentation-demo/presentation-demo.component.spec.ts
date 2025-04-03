import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationDemoComponent } from './presentation-demo.component';

describe('PresentationDemoComponent', () => {
  let component: PresentationDemoComponent;
  let fixture: ComponentFixture<PresentationDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
