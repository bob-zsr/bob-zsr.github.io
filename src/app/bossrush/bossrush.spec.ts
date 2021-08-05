import * as BR from './bossrush';

function getTotalCombinations(startingBossId: string, count: number): number {
  const combos = BR.getAllCombos(startingBossId, count);
  return combos.reduce((pv, cv) => pv + cv.permutations, 0);
}

function expectCombos(startingBossId: string, count: number, combos: string[]) {
  const allCombos = BR.getAllCombos(startingBossId, count).reduce((pv, cv) => pv + cv.bosses + '  ', '');
  let totalLength = 0;
  combos.forEach(combo => {
    expect(allCombos).toContain(combo + '  ');
    totalLength += (combo + '  ').length;
  });
  expect(allCombos.length).toBe(totalLength);
}

function countPermutations(result: BR.CalculationResult): number {
  return result.data.reduce((pv, cv) => pv + cv.combinations.reduce((ppv, ccv) => ppv + ccv.permutations, 0), 0);
}

describe('Bossrush Calculator', () => {
  const allBosses = BR.getAllBosses();

  function forEachBoss(fn: (boss: BR.Boss) => void): void {
    allBosses.forEach(fn);
  }

  describe('getAllCombos', () => {
    it('should return correct number of total permutations', () => {
      forEachBoss(boss => {
        let expectedTotal = 1;
        for (let count = 1; count <= 12; ++count) {
          expect(getTotalCombinations(boss.id, count)).toBe(expectedTotal);
          expectedTotal = expectedTotal * 3; // 3 ways to select the next boss
        }
      });
    });

    it('should return correct combinations', () => {
      expectCombos('s', 2, [
        'g1 s', 's g3', 's i3'
      ]);

      expectCombos('g1', 2, [
        'g1 s', 'g1 g3', 'g1 i3'
      ]);

      expectCombos('g1', 3, [
        'g1 s m',
        'g1 s g3',
        'g1 s i3',
        'g1 i3 g3',
        'g1 t i3'
      ]);
    });

    it('should not include demise if not picked first', () => {
      const demiseCombos = BR.getAllCombos('k', 11).filter(combo => combo.bosses.indexOf('d') !== -1);
      expect(demiseCombos.length).toBe(0);
    });
  });

  describe('calculate', () => {
    it('should include correct number of total permutations', () => {
      expect(countPermutations(BR.calculate([], 1))).toBe(12);
      expect(countPermutations(BR.calculate([], 2))).toBe(12 * 3);
      expect(countPermutations(BR.calculate([], 3))).toBe(12 * 3 * 3);
      expect(countPermutations(BR.calculate([], 4))).toBe(12 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 5))).toBe(12 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 6))).toBe(12 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 7))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 8))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 9))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 10))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 11))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3);
      expect(countPermutations(BR.calculate([], 12))).toBe(12 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3 * 3);
    });

    it('should use given settings', () => {
      const settings = BR.getDefaultSettings();
      settings.bossTimes.d = 5000;
      settings.bossTimes.g1 = 420;
      const result = BR.calculate(['d'], 2, settings);
      expect(result.selectedData).toBeTruthy();
      const matchingCombo = result.selectedData!.combinations.find(combo =>
        combo.bosses.some(b => b.id === 'g1') && combo.bosses.some(b => b.id === 'd'));
      expect(matchingCombo).toBeTruthy();
      expect(matchingCombo!.time).toBe(5420);
    });

    it('should return correct recommendation', () => {
      const settings = BR.getDefaultSettings();
      // to make the math simpler to sanity-check, set all bosses to the same time
      // except make one longer (Ghirahim 3).
      settings.bossTimes = {
        g1: 1,
        s: 1,
        m: 1,
        i1: 1,
        k: 1,
        t: 1,
        g2: 1,
        i2: 1,
        i3: 1,
        h: 1,
        g3: 2,
        d: 1
      };

      // To take the HP now gives us:
      //    1 chance of getting the long fight in the set of 4
      //    8 chances of getting the long fight in the set of 8.
      // To take the Shield now gives us:
      //    5 chances of getting the long fight in the set of 8
      //    4 chances of getting it in the set of 4.
      // So we expect it to recommend taking the HP now since we have a good chance of having a fast set of 4.
      let result = BR.calculate(['d', 'g1', 's'], 8, settings);
      expect(result.recommendation).toBeGreaterThan(0.5);

      // To take the HP now gives us:
      //    100% chance of getting the long fight in the set of 4.
      //    8 chances of getting the long fight in the set of 8.
      // To take the Shield now gives us:
      //    100% chance of getting the long fight in the set of 8.
      //    4 chances of getting the long fight in the set of 4.
      // So we expect it to recommend taking the shield now so that we have better odds of skipping it in the retry.
      result = BR.calculate(['d', 'g3'], 8, settings);
      expect(result.recommendation).toBeLessThan(0.5);
    });

    it('should deduct from remaining lists', () => {
      const result = BR.calculate(['d', 'g1', 's'], 8);
      expect(result.remainingList0.findIndex(b => b.id === 's' || b.id === 'g1' || b.id === 'd')).toBe(-1);
      expect(result.remainingList1.findIndex(b => b.id === 's' || b.id === 'g1' || b.id === 'd')).toBe(-1);
      expect(result.remainingList2.findIndex(b => b.id === 's' || b.id === 'g1' || b.id === 'd')).toBe(-1);
    });

    it('should have probabilities adding to 1', () => {
      for (let i = 1; i <= 12; ++i) {
        forEachBoss(boss => {
          const result = BR.calculate([boss.id], i);
          expect(result.selectedData).toBeTruthy();
          expect(result.selectedData!.combinations.reduce((pv, cv) => {
            if (cv.probability === undefined) {
              throw Error("Missing probability");
            }
            return pv + cv.probability;
          }, 0)).toBeCloseTo(1);
        });
      }
    });

    it('should post-mortem analyze correctly', () => {
      // should be 2nd worst combination out of 27 possibilities.
      //  only 1 way to get this
      //  but 3 ways to get d+i3+t+g3
      let result = BR.calculate(['d', 'i3', 't', 'g2'], 4);
      expect(result.result).toBeCloseTo(4 / 27);

      // should be 2nd best combination out of 27 possibilities
      //  1 way to get g1+s+m, so only 1 strictly better permutation
      result = BR.calculate(['d', 'g1', 's', 'g3'], 4);
      expect(result.result).toBeCloseTo(26 / 27);
    });
  });
});
