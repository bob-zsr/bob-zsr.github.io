import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SkywardSwordModule } from '../skywardsword/skywardsword.module';
import { Boss, CombinationData, getAllBosses, getDefaultSettings } from './bossrush';
import { BossrushComponent } from './bossrush.component';
import { BossrushService } from './bossrush.service';
import { BossrushDataDetailComponent } from './data-detail/bossrush-data-detail.component';
import { BossrushDataSummaryComponent } from './data-summary/bossrush-data-summary.component';
import { BossrushIngestComponent } from './ingest/bossrush-ingest.component';
import { BossrushSettingsComponent } from './settings/bossrush-settings.component';

describe('BossrushComponent', () => {
  let component: BossrushComponent;
  let fixture: ComponentFixture<BossrushComponent>;

  beforeEach(() => {
    const mock = {
      bosses: <Boss[]>[],
      allBosses: getAllBosses(),
      remainingList0: { list: <Boss[]>[] },
      remainingList1: { list: <Boss[]>[] },
      remainingList2: { list: <Boss[]>[] },
      data: <CombinationData[]>[],
      selectedData: <CombinationData>null,
      count: 2,
      settings: getDefaultSettings(),
      result: <number>undefined,
      recommendation: <number>undefined,
      actualTime: 0,
      onSettings$: of([]),
      nextBoss: () => {},
      back: () => {},
      resetSettings: () => {},
      loadSettings: () => {},
      refresh: () => {}
    };
    const routes: Routes = [
      {
        path: 'bossrush',
        component: BossrushComponent
      }
    ];
    TestBed.configureTestingModule({
      declarations: [
        BossrushComponent,
        BossrushIngestComponent,
        BossrushDataDetailComponent,
        BossrushDataSummaryComponent,
        BossrushSettingsComponent
      ],
      imports: [
        FormsModule,
        SkywardSwordModule,
        CommonModule,
        BrowserModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        {
          provide: BossrushService,
          useValue: mock
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BossrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
