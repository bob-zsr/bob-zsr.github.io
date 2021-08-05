import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BossrushService } from './bossrush.service';

@Component({
  selector: 'app-bossrush',
  templateUrl: './bossrush.component.html',
  styleUrls: ['./bossrush.component.scss']
})
export class BossrushComponent implements OnInit, OnDestroy {
  private readonly stop = new Subject<any>();

  public page = 'data';

  constructor(public service: BossrushService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnDestroy() {
    this.stop.next(null);
    this.stop.complete();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.loadSettings(params);
    });
    this.service.onSettings$.pipe(
      takeUntil(this.stop.asObservable())
    ).subscribe(settings => {
      const params: { [key: string]: string } = {};
      settings.forEach(setting => params[setting[0]] = setting[1]);
      this.router.navigate(['/bossrush', params]);
    });
  }
}
