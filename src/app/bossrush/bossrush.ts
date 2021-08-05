export interface Boss {
    name: string;
    id: BossId;
    order: number;
}

export interface BossInfo<T> {
    g1: T;
    s: T;
    m: T;
    i1: T;
    k: T;
    t: T;
    g2: T;
    i2: T;
    i3: T;
    h: T;
    g3: T;
    d: T;
}

const bossList: Boss[] = [
    {
        name: 'Ghirahim 1',
        id: 'g1',
        order: 0
    },
    {
        name: 'Scaldera',
        id: 's',
        order: 1
    },
    {
        name: 'Molderach',
        id: 'm',
        order: 2
    },
    {
        name: 'Imprisoned 1',
        id: 'i1',
        order: 3
    },
    {
        name: 'Koloktos',
        id: 'k',
        order: 4
    },
    {
        name: 'Tentalus',
        id: 't',
        order: 5
    },
    {
        name: 'Ghirahim 2',
        id: 'g2',
        order: 6
    },
    {
        name: 'Imprisoned 2',
        id: 'i2',
        order: 7
    },
    {
        name: 'Imprisoned 3',
        id: 'i3',
        order: 8
    },
    {
        name: 'Horde',
        id: 'h',
        order: 9
    },
    {
        name: 'Ghirahim 3',
        id: 'g3',
        order: 10
    },
    {
        name: 'Demise',
        id: 'd',
        order: 11
    }
];

const bossMap = new Map<BossId, Boss>();

bossList.forEach(boss => bossMap.set(boss.id, boss));

export const list0: BossId[] = ['g1', 's', 'm', 'i1', 'k', 't', 'g2', 'i2', 'i3', 'h', 'g3', 'd'];
export const list1: BossId[] = ['g3', 's', 'i3', 'i1', 'g1', 'h', 'k', 'i2', 't', 'g2', 'm', 'd'];
export const list2: BossId[] = ['i3', 't', 'g2', 'g3', 'g1', 'i2', 'k', 's', 'i1', 'h', 'm', 'd'];

export interface Combination {
    bosses: Boss[];
    permutations: number;
    probability?: number;
    time: number;
}

export interface ProbableTime {
    time: number;
    probability: number;
}

export interface CombinationData {
    startingBosses: Boss[];
    bestTime: ProbableTime;
    worstTime: ProbableTime;
    medianTime: number;
    ev: number;
    willSee: Boss[];
    wontSee: Boss[];
    combinations: Combination[];
    probabilities: BossInfo<number>;
}

export function getAllBosses(): Boss[] {
    return bossList.slice();
}

function getWorst(combinations: Combination[]): ProbableTime {
    const totalCombos = combinations.reduce((pv, cv) => pv + cv.permutations, 0);
    const worstCombos: Combination[] = combinations
        .slice(combinations
            .findIndex(x => x.time === combinations[combinations.length - 1].time));

    return {
        time: worstCombos[0].time,
        probability: worstCombos.reduce((pv, cv) => pv + cv.permutations, 0) / totalCombos
    };
}

function getBest(combinations: Combination[]): ProbableTime {
    const totalCombos = combinations.reduce((pv, cv) => pv + cv.permutations, 0);
    const firstHigherComboIndex = combinations.findIndex(x => x.time !== combinations[0].time);
    const bestCombos: Combination[] = firstHigherComboIndex === -1 ? combinations.slice() : combinations.slice(0, firstHigherComboIndex);

    return {
        probability: bestCombos.reduce((pv, cv) => pv + cv.permutations, 0) / totalCombos,
        time: bestCombos.length ? bestCombos[0].time : -1
    };
}

function getMedian(combinations: Combination[]): number {
    const totalCombos = combinations.reduce((pv, cv) => pv + cv.permutations, 0);
    const half = totalCombos / 2;
    let previousCombo: Combination | null = null;
    let totalSoFar = 0;

    for (const combo of combinations) {
        if (totalSoFar + combo.permutations >= half) {
            if (half !== totalSoFar + 0.5) {
                return combo.time;
            } else {
                if (previousCombo) {
                    return (combo.time + previousCombo.time) / 2;
                }
                return combo.time;
            }
        } else {
            totalSoFar += combo.permutations;
        }
        previousCombo = combo;
    }

    return 0;
}

function getEv(combinations: Combination[]): number {
    let sumOfTime = 0;
    let sumOfCombos = 0;

    combinations.forEach(combo => {
        sumOfTime += combo.time * combo.permutations;
        sumOfCombos += combo.permutations;
    });

    return sumOfTime / sumOfCombos;
}

export interface Settings {
    bossTimes: BossInfo<number>;
    showBosses: BossInfo<boolean>;
    showExpected: boolean;
    showBest: boolean;
    showWorst: boolean;
    showMedian: boolean;
    showWillSee: boolean;
    showWontSee: boolean;
}

const defaultBosstimes = getDefaultSettings().bossTimes;
export type BossId = keyof typeof defaultBosstimes;

export interface DebugCombination {
    bosses: string;
    permutations: number;
}

const allCombinations = new Map<number, Map<string, DebugCombination[]>>();

function getOrCreateComboMap(count: number): Map<string, DebugCombination[]> {
    if (allCombinations.has(count)) {
        const r = allCombinations.get(count);
        if (!r) {
            throw Error("Invalid state in combination map");
        }
        return r;
    } else {
        const result = new Map<string, DebugCombination[]>();
        allCombinations.set(count, result);
        return result;
    }
}

function getOrCreateCombinationList(startingBossId: string, count: number): DebugCombination[] {
    const bossCombinations = getOrCreateComboMap(count);

    if (bossCombinations.has(startingBossId)) {
        const r = bossCombinations.get(startingBossId);
        if (!r) {
            throw Error("Invalid state in combination map");
        }
        return r;
    }

    const result: DebugCombination[] = [];
    bossCombinations.set(startingBossId, result);
    return result;
}

export function getBoss(id: BossId): Boss {
    if (bossMap.has(id)) {
        const result = bossMap.get(id);
        if (!result) {
            throw Error("Missing boss with id " + id);
        }
        return result;
    }
    throw Error("Missing boss with id " + id);
}

function addBoss(comboId: string, bossId: BossId | undefined): string {
    if (!bossId) {
        throw Error("Missing boss id");
    }
    const result = comboId.split(' ');
    result.push(bossId);
    result.sort((a, b) => getBoss(<BossId>a).order - getBoss(<BossId>b).order);
    return result.join(' ');
}

export function getAllCombos(startingBossId: string, count: number): DebugCombination[] {
    const existingCombos = getOrCreateCombinationList(startingBossId, count);
    if (existingCombos.length) {
        return existingCombos;
    }

    if (count === 1) {
        existingCombos.push({
            bosses: startingBossId,
            permutations: 1
        });
        return existingCombos;
    }

    const previousCombos = getAllCombos(startingBossId, count - 1);
    const map = new Map<string, DebugCombination>();

    previousCombos.forEach(combo => {
        const l0comboId = addBoss(combo.bosses, list0.find(bossid => combo.bosses.indexOf(bossid) === -1));
        const l1comboId = addBoss(combo.bosses, list1.find(bossid => combo.bosses.indexOf(bossid) === -1));
        const l2comboId = addBoss(combo.bosses, list2.find(bossid => combo.bosses.indexOf(bossid) === -1));

        [l0comboId, l1comboId, l2comboId].forEach(newComboId => {
            let debugCombo: DebugCombination | undefined = undefined;
            if (map.has(newComboId)) {
                debugCombo = map.get(newComboId);
            } else {
                debugCombo = {
                    bosses: newComboId,
                    permutations: 0
                };
                map.set(newComboId, debugCombo);
            }
            if (!debugCombo) {
                throw Error("Missing debug combo");
            }

            debugCombo.permutations = debugCombo.permutations + combo.permutations;
        });
    });

    map.forEach(combo => existingCombos.push(combo));

    return existingCombos;
}

export function getDefaultSettings(): Settings {
    return {
        bossTimes: {
            g1: 27.9,
            s: 47.7,
            m: 46.2,
            i1: 125.3,
            k: 118,
            t: 194.1,
            g2: 48.9,
            i2: 85.8,
            i3: 160.9,
            h: 140,
            g3: 103.9,
            d: 55.3
        },
        showBosses: {
            g1: false,
            s: false,
            m: false,
            i1: false,
            k: false,
            t: false,
            g2: false,
            i2: false,
            i3: false,
            h: false,
            g3: false,
            d: false
        },
        showExpected: true,
        showBest: true,
        showWorst: true,
        showMedian: false,
        showWillSee: false,
        showWontSee: false
    };
}

export interface CalculationResult {
    remainingList0: Boss[];
    remainingList1: Boss[];
    remainingList2: Boss[];
    data: CombinationData[];
    selectedData: CombinationData | null;
    result: number | undefined;
    recommendation: number | undefined;
    actualTime: number;
}

export function getCombinations(settings: Settings, bosses: Boss[], count: number): CombinationData {
    const allBosses = getAllBosses();
    const debugCombos = getAllCombos(bosses[0].id, count).filter(c => bosses.every(b => c.bosses.indexOf(b.id) !== -1));
    const totalPermutations = debugCombos.reduce((pv, cv) => pv + cv.permutations, 0);
    const combinations: Combination[] = debugCombos.map(c => {
        const bossIds = c.bosses.split(' ') as BossId[];
        return {
            permutations: c.permutations,
            probability: c.permutations / totalPermutations,
            bosses: bossIds.map(bossId => getBoss(bossId)).sort((a, b) => a.order - b.order),
            time: bossIds.reduce((pv, cv) => pv + settings.bossTimes[cv], 0)
        };
    });
    const probabilities: any = {};
    allBosses.forEach(boss => {
        let totalCombos = 0;
        let combosWithBoss = 0;

        combinations.forEach(combo => {
            totalCombos += combo.permutations;
            if (combo.bosses.some(b => boss.id === b.id)) {
                combosWithBoss += combo.permutations;
            }
        });

        probabilities[boss.id] = combosWithBoss / totalCombos;
    });
    combinations.sort((a, b) => a.time - b.time);

    return {
        startingBosses: bosses,
        combinations: combinations,
        probabilities,
        ev: getEv(combinations),
        medianTime: getMedian(combinations),
        bestTime: getBest(combinations),
        worstTime: getWorst(combinations),
        willSee: allBosses.filter(boss =>
            combinations.findIndex(c => c.bosses.every(bs => bs.id !== boss.id)) === -1
            && bosses.findIndex(bs => bs.id === boss.id) === -1),
        wontSee: allBosses.filter(boss =>
            combinations.findIndex(c => c.bosses.some(bs => bs.id === boss.id)) === -1
            && bosses.findIndex(bs => bs.id === boss.id) === -1)
    };
}

function combine(combos1: Combination[], combos2: Combination[]): Map<number, number> {
    const result = new Map<number, number>();

    combos1.forEach(combo1 => {
        combos2.forEach(combo2 => {
            if (combo1.probability === undefined || combo2.probability === undefined) {
                throw Error("Missing probability in combination");
            }
            const totalTime = combo1.time + combo2.time;
            if (result.has(totalTime)) {
                const currentProb = result.get(totalTime);
                if (currentProb === undefined) {
                    throw Error("Invalid result map");
                }
                result.set(totalTime, currentProb + (combo1.probability * combo2.probability));
            } else {
                result.set(totalTime, combo1.probability * combo2.probability);
            }
        });
    });

    return result;
}

export function calculate(bossIds: BossId[]
        , count: number
        , settings?: Settings
        , restartBoss4Id?: BossId
        , restartBoss8Id?: BossId
        ): CalculationResult {
    const bosses = (bossIds || []).map(id => getBoss(id));
    const settingsDef = settings || getDefaultSettings();
    restartBoss4Id = restartBoss4Id || 'g1';
    restartBoss8Id = restartBoss8Id || 'd';

    const allBosses = getAllBosses();
    const actualTime = bosses.map(boss => settingsDef.bossTimes[boss.id]).reduce((pv, cv) => pv + cv, 0);
    const data = allBosses.map((boss) => getCombinations(settingsDef, [boss], count));
    const remainingList0 = list0.map(id => allBosses.find(boss => boss.id === id))
                                .filter(boss => bosses.findIndex(b => b.id === boss!.id) === -1) as Boss[];
    const remainingList1 = list1.map(id => allBosses.find(boss => boss.id === id))
                                .filter(boss => bosses.findIndex(b => b.id === boss!.id) === -1) as Boss[];
    const remainingList2 = list2.map(id => allBosses.find(boss => boss.id === id))
                                .filter(boss => bosses.findIndex(b => b.id === boss!.id) === -1) as Boss[];

    const selectedData = bosses.length ? getCombinations(settingsDef, bosses, count) : null;
    let result: number | undefined = undefined;
    if (bosses.length === count) {
        const originalCombinations = getCombinations(settingsDef, [bosses[0]], count);
        let countBelow = 0;
        let countTotal = 0;

        originalCombinations.combinations.forEach(combo => {
            countTotal += combo.permutations;
            if (combo.time >= actualTime) {
                countBelow += combo.permutations;
            }
        });

        result = countBelow / countTotal;
    }

    let recommendation: number | undefined = undefined;
    if (count === 8 && bosses.length <= 4 && bosses.length !== 0) {
        const ifTake4Combos = getCombinations(settingsDef, bosses, 4);
        const ifTake8Combos = getCombinations(settingsDef, bosses, 8);
        const new8Combos = getCombinations(settingsDef, [getBoss(restartBoss8Id)], 8);
        const new4Combos = getCombinations(settingsDef, [getBoss(restartBoss4Id)], 4);

        const ifTake4 = combine(ifTake4Combos.combinations, new8Combos.combinations);
        const ifTake8 = combine(ifTake8Combos.combinations, new4Combos.combinations);

        let prob4IsBetter = 0;
        let prob4IsEqual = 0;

        ifTake4.forEach((prob4, time4) => {
            ifTake8.forEach((prob8, time8) => {
                if (time4 < time8) {
                    prob4IsBetter += prob4 * prob8;
                } else if (time4 === time8) {
                    prob4IsEqual += prob4 * prob8;
                }
            });
        });

        recommendation = prob4IsBetter / (1 - prob4IsEqual);
    }

    return {
        actualTime,
        data,
        recommendation,
        remainingList0,
        remainingList1,
        remainingList2,
        result,
        selectedData
    };
}
