import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenDriversComponent } from './orden-drivers.component';

describe('OrdenDriversComponent', () => {
  let component: OrdenDriversComponent;
  let fixture: ComponentFixture<OrdenDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
