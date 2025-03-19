import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValtoComponent } from './valto.component';

describe('ValtoComponent', () => {
  let component: ValtoComponent;
  let fixture: ComponentFixture<ValtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValtoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
