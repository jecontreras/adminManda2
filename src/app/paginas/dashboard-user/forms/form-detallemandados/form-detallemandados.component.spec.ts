import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetallemandadosComponent } from './form-detallemandados.component';

describe('FormDetallemandadosComponent', () => {
  let component: FormDetallemandadosComponent;
  let fixture: ComponentFixture<FormDetallemandadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDetallemandadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetallemandadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
