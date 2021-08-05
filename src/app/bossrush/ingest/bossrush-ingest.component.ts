import { Component, OnInit } from '@angular/core';
import { Boss } from '../bossrush';
import { BossrushService } from '../bossrush.service';

@Component({
    selector: 'app-bossrush-ingest',
    templateUrl: 'bossrush-ingest.component.html',
    styleUrls: ['bossrush-ingest.component.scss']
})
export class BossrushIngestComponent implements OnInit {
    first: Boss | null = null;

    constructor(public service: BossrushService) {
    }

    ngOnInit() {

    }

    onFirstBossSelected(e: any) {
        const foundBoss = this.service.allBosses.find(b => b.id === e.target.value);
        if (!foundBoss) {
            throw Error(`Could not find boss with id ${e.target.value}`);
        }
        this.service.nextBoss(foundBoss);
    }

    onCountChanged(e: string) {
        this.service.count = parseInt(e, 10);
        this.service.refresh();
    }

    back() {
        this.first = null;
        this.service.back();
    }
}
