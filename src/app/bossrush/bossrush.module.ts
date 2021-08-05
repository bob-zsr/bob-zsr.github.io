import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SkywardSwordModule } from '../skywardsword/skywardsword.module';
import { BossrushComponent } from './bossrush.component';
import { BossrushService } from './bossrush.service';
import { BossrushDataDetailComponent } from './data-detail/bossrush-data-detail.component';
import { BossrushDataSummaryComponent } from './data-summary/bossrush-data-summary.component';
import { BossrushIngestComponent } from './ingest/bossrush-ingest.component';
import { BossrushSettingsComponent } from './settings/bossrush-settings.component';

@NgModule({
    declarations: [
        BossrushComponent,
        BossrushIngestComponent,
        BossrushDataDetailComponent,
        BossrushDataSummaryComponent,
        BossrushSettingsComponent
    ],
    exports: [
        BossrushComponent
    ],
    imports: [
        FormsModule,
        SkywardSwordModule,
        CommonModule,
        BrowserModule
    ],
    providers: [BossrushService]
})
export class BossrushModule { }
