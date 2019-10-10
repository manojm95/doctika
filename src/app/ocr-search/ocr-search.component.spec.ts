import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrSearchComponent } from './ocr-search.component';

describe('OcrSearchComponent', () => {
  let component: OcrSearchComponent;
  let fixture: ComponentFixture<OcrSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
