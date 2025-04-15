import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTestSlideComponent } from './static-test-slide.component';

describe('StaticTestSlideComponent', () => {
  let component: StaticTestSlideComponent;
  let fixture: ComponentFixture<StaticTestSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticTestSlideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticTestSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
