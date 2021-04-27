import { LOCALSTORAGE, DESIGN } from '@/utils/constants';

import i18n from './i18n'; // eslint-disable-line import/no-cycle

export default ({
  rememberLanguage: (language) => {
    i18n.i18next.changeLanguage(language);
  },

  rememberDifficulty: (difficulty) => {
    localStorage.setItem(LOCALSTORAGE.DIFFICULTY, difficulty);
  },

  rememberLevel: (level, levelFrom) => {
    localStorage.setItem(LOCALSTORAGE.LEVEL, level);
    localStorage.setItem(LOCALSTORAGE.LEVELFROM, levelFrom);
  },

  saveHero: (scope, isF5, isWin) => {
    localStorage.setItem(LOCALSTORAGE.HEALTH, scope.health);
    localStorage.setItem(LOCALSTORAGE.ENDURANCE, scope.endurance);
    localStorage.setItem(LOCALSTORAGE.AMMO, scope.ammo);
    localStorage.setItem(LOCALSTORAGE.WEIGHT, scope.weight);

    localStorage.setItem(LOCALSTORAGE.RED, scope.red);
    localStorage.setItem(LOCALSTORAGE.ORANGE, scope.orange);
    localStorage.setItem(LOCALSTORAGE.GREEN, scope.green);
    localStorage.setItem(LOCALSTORAGE.PURPLE, scope.purple);

    scope.passes.forEach((pass) => {
      localStorage.setItem(LOCALSTORAGE[`PASS${pass.toUpperCase()}`], 1);
    });

    if (!isF5 && !isWin) {
      localStorage.setItem(LOCALSTORAGE.DIRECTIONX, scope.hero.getHeroDirection().x);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONY, scope.hero.getHeroDirection().y);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, scope.hero.getHeroDirection().z);
    } else {
      if (scope.levelFrom > scope.level) {
        localStorage.setItem(LOCALSTORAGE.DIRECTIONX, DESIGN.HERO.START[`level${scope.level}`].end.direction.x);
        localStorage.setItem(LOCALSTORAGE.DIRECTIONY, DESIGN.HERO.START[`level${scope.level}`].end.direction.y);
        localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, DESIGN.HERO.START[`level${scope.level}`].end.direction.z);
      } else {
        localStorage.setItem(LOCALSTORAGE.DIRECTIONX, DESIGN.HERO.START[`level${scope.level}`].start.direction.x);
        localStorage.setItem(LOCALSTORAGE.DIRECTIONY, DESIGN.HERO.START[`level${scope.level}`].start.direction.y);
        localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, DESIGN.HERO.START[`level${scope.level}`].start.direction.z);
      }
    }
  },

  updateHero: (level, isFirst) => {
    localStorage.setItem(LOCALSTORAGE.HEALTH, DESIGN.HERO.scales.health.start);
    localStorage.setItem(LOCALSTORAGE.ENDURANCE, DESIGN.HERO.scales.endurance.start);
    localStorage.setItem(LOCALSTORAGE.AMMO, DESIGN.HERO.scales.ammo.start);
    localStorage.setItem(LOCALSTORAGE.WEIGHT, DESIGN.HERO.scales.weight.start);

    localStorage.setItem(LOCALSTORAGE.RED, 0);
    localStorage.setItem(LOCALSTORAGE.ORANGE, 0);
    localStorage.setItem(LOCALSTORAGE.GREEN, 0);
    localStorage.setItem(LOCALSTORAGE.PURPLE, 0);

    if (isFirst || level === 0) {
      localStorage.setItem(LOCALSTORAGE.PASSRED, 0);
      localStorage.setItem(LOCALSTORAGE.PASSORANGE, 0);
      localStorage.setItem(LOCALSTORAGE.PASSGREEN, 0);
      localStorage.setItem(LOCALSTORAGE.PASSPURPLE, 0);
      localStorage.setItem(LOCALSTORAGE.PASSBLUE, 0);

      localStorage.setItem(LOCALSTORAGE.DIRECTIONX, DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.x);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONY, DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.y);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.z);
    } else {
      localStorage.setItem(LOCALSTORAGE.DIRECTIONX, DESIGN.HERO.START[`level${level}`].start.direction.x);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONY, DESIGN.HERO.START[`level${level}`].start.direction.y);
      localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, DESIGN.HERO.START[`level${level}`].start.direction.z);
    }
  },
});
