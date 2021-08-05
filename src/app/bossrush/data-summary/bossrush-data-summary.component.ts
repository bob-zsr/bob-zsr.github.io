import { Component } from '@angular/core';
import { BossrushService } from '../bossrush.service';

@Component({
    selector: 'app-bossrush-data-summary',
    templateUrl: 'bossrush-data-summary.component.html',
    styleUrls: ['bossrush-data-summary.component.scss']
})
export class BossrushDataSummaryComponent {
    private direction = 1;
    private sortKey = '';

    constructor(public service: BossrushService) {
    }

    onSortClicked(key: string) {
      if (this.sortKey === key) {
        this.direction = -this.direction;
      } else {
        this.direction = 1;
        this.sortKey = key;
      }
      const dir = this.direction;
      switch (this.sortKey) {
        case 'best':
          this.service.data.sort((a, b) => dir * (a.bestTime.time - b.bestTime.time));
          break;
        case 'ev':
          this.service.data.sort((a, b) => dir * (a.ev - b.ev));
          break;
        case 'worst':
          this.service.data.sort((a, b) => dir * (a.worstTime.time - b.worstTime.time));
          break;
        case 'median':
          this.service.data.sort((a, b) => dir * (a.medianTime - b.medianTime));
          break;
        default:
          this.service.data.sort((a, b) => {
            if (!a.startingBosses.length || a.startingBosses[0].order === undefined) {
              if (!b.startingBosses.length || b.startingBosses[0].order === undefined) {
                return 0;
              } else {
                return -1;
              }
            } else if (!b.startingBosses.length || b.startingBosses[0].order === undefined) {
              return 1;
            }

            return dir * (a.startingBosses[0].order - b.startingBosses[0].order);
          });
          break;
      }
    }
}
