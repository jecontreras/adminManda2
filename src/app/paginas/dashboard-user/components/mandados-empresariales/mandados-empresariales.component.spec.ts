import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandadosEmpresarialesComponent } from './mandados-empresariales.component';

describe('MandadosEmpresarialesComponent', () => {
  let component: MandadosEmpresarialesComponent;
  let fixture: ComponentFixture<MandadosEmpresarialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandadosEmpresarialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandadosEmpresarialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
