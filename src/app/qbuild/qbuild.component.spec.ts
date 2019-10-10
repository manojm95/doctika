import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QbuildComponent } from './qbuild.component';

describe('QbuildComponent', () => {
  let component: QbuildComponent;
  let fixture: ComponentFixture<QbuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QbuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QbuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
