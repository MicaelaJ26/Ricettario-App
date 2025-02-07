import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixItUpComponent } from './mix-it-up.component';

describe('MixItUpComponent', () => {
  let component: MixItUpComponent;
  let fixture: ComponentFixture<MixItUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MixItUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MixItUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
