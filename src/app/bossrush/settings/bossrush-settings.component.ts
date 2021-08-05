import { Component } from '@angular/core';
import { BossrushService } from '../bossrush.service';

@Component({
    selector: 'app-bossrush-settings',
    templateUrl: 'bossrush-settings.component.html',
    styleUrls: ['bossrush-settings.component.scss']
})
export class BossrushSettingsComponent {
    constructor(public service: BossrushService) {
    }
}
