import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPresentationComponent } from './no-presentation.component';

describe('NoPresentationComponent', () => {
  let component: NoPresentationComponent;
  let fixture: ComponentFixture<NoPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPresentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
