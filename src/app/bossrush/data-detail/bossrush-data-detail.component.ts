import { Component } from '@angular/core';
import { BossrushService } from '../bossrush.service';

@Component({
    selector: 'app-bossrush-data-detail',
    templateUrl: 'bossrush-data-detail.component.html',
    styleUrls: ['bossrush-data-detail.component.scss']
})
export class BossrushDataDetailComponent {
    public direction = 1;
    public sortKey = '';

    constructor(public service: BossrushService) {
    }

    onSortClicked(sort: string) {
        if (this.sortKey === sort) {
            this.direction = -this.direction;
        } else {
            this.direction = 1;
            this.sortKey = sort;
        }
        const dir = this.direction;
        const data = this.service.selectedData;
        if (data === null) {
          return;
        }
        const combos = data.combinations;
        switch (this.sortKey) {
          case 'combo':
            combos.sort((a, b) => dir * (a.permutations - b.permutations));
            break;
          case 'time':
            combos.sort((a, b) => dir * (a.time - b.time));
            break;
          default:
            combos.sort((a, b) => dir * (a.bosses.join(' ').localeCompare(b.bosses.join(' '))));
            break;
        }
    }
}
