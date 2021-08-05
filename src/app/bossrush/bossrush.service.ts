import { ParamMap } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Boss, BossId, calculate, CombinationData, getAllBosses, getBoss, getDefaultSettings, list0, list1, list2, Settings } from './bossrush';

function setBool(paramMap: ParamMap, key: string, source: any, setKey: string): boolean {
  if (paramMap.has(key)) {
    source[setKey] = paramMap.get(key) === '1';
    return true;
  }
  return false;
}

export class BossrushService {
  private onSettings = new Subject<[string, string][]>();

  /**
   * List of bosses currently selected
   */
  bosses: Boss[];
  allBosses: Boss[];

  remainingList0: { list: Boss[] };
  remainingList1: { list: Boss[] };
  remainingList2: { list: Boss[] };
  data: CombinationData[] = [];
  selectedData: CombinationData | null = null;
  count: number;
  settings: Settings;
  result: number | undefined;
  recommendation: number | undefined;
  actualTime = 0;
  restartBoss4Id: BossId = 'g1';
  restartBoss8Id: BossId = 'd';
  list0: Boss[];
  list1: Boss[];
  list2: Boss[];

  onSettings$: Observable<[string, string][]>;

  constructor() {
    this.bosses = [];
    this.allBosses = getAllBosses();
    this.list0 = list0.map(bossId => getBoss(bossId));
    this.list1 = list1.map(bossId => getBoss(bossId));
    this.list2 = list2.map(bossId => getBoss(bossId));
    this.remainingList0 = { list: this.list0 };
    this.remainingList1 = { list: this.list1 };
    this.remainingList2 = { list: this.list2 };
    this.count = 8;
    this.result = undefined;
    this.settings = getDefaultSettings();
    this.onSettings$ = this.onSettings.asObservable();
    this.refresh();
  }

  nextBoss(boss: Boss) {
    this.bosses.push(boss);
    this.refresh();
  }

  back() {
    this.bosses.splice(this.bosses.length - 1, 1);
    this.refresh();
  }

  resetSettings() {
    this.settings = getDefaultSettings();
    this.refresh();
  }

  loadSettings(paramMap: ParamMap) {
    let changed = false;
    changed = setBool(paramMap, 'ev', this.settings, 'showExpected') || changed;
    changed = setBool(paramMap, 'best', this.settings, 'showBest') || changed;
    changed = setBool(paramMap, 'worst', this.settings, 'showWorst') || changed;
    changed = setBool(paramMap, 'med', this.settings, 'showMedian') || changed;
    changed = setBool(paramMap, 'will', this.settings, 'showWillSee') || changed;
    changed = setBool(paramMap, 'wont', this.settings, 'showWontSee') || changed;
    this.allBosses.forEach(boss => {
      changed = setBool(paramMap, 'show' + boss.id, this.settings.showBosses, boss.id) || changed;
      if (paramMap.has(boss.id)) {
        const value = paramMap.get(boss.id);
        if (value === null) {
          throw Error("Invalid parameter map");
        }
        this.settings.bossTimes[boss.id] = parseFloat(value);
        changed = true;
      }
    });
    if (changed) {
      this.refresh();
    }
  }

  refresh() {
    const result = calculate(this.bosses.map(boss => boss.id), this.count, this.settings, this.restartBoss4Id, this.restartBoss8Id);
    this.actualTime = result.actualTime;
    this.remainingList0 = { list: result.remainingList0 };
    this.remainingList1 = { list: result.remainingList1 };
    this.remainingList2 = { list: result.remainingList2 };
    this.data = result.data;
    this.selectedData = result.selectedData;
    this.result = result.result;
    this.recommendation = result.recommendation;
    const settingsChanges: [string, string][] = [];
    const defaultSettings = getDefaultSettings();
    if (this.settings.showExpected !== defaultSettings.showExpected) {
      settingsChanges.push(['ev', (this.settings.showExpected ? '1' : '0')]);
    }
    if (this.settings.showBest !== defaultSettings.showBest) {
      settingsChanges.push(['best', (this.settings.showBest ? '1' : '0')]);
    }
    if (this.settings.showWorst !== defaultSettings.showWorst) {
      settingsChanges.push(['worst', (this.settings.showWorst ? '1' : '0')]);
    }
    if (this.settings.showMedian !== defaultSettings.showMedian) {
      settingsChanges.push(['med', (this.settings.showMedian ? '1' : '0')]);
    }
    if (this.settings.showWillSee !== defaultSettings.showWillSee) {
      settingsChanges.push(['will', (this.settings.showWillSee ? '1' : '0')]);
    }
    if (this.settings.showWontSee !== defaultSettings.showWontSee) {
      settingsChanges.push(['wont', (this.settings.showWontSee ? '1' : '0')]);
    }
    this.allBosses.forEach(boss => {
      if (this.settings.showBosses[boss.id] !== defaultSettings.showBosses[boss.id]) {
        settingsChanges.push(['show' + boss.id, (this.settings.showBosses[boss.id] ? '1' : '0')]);
      }
      if (this.settings.bossTimes[boss.id] !== defaultSettings.bossTimes[boss.id]) {
        settingsChanges.push([boss.id, this.settings.bossTimes[boss.id].toString()]);
      }
    });
    this.onSettings.next(settingsChanges);
  }
 }
