import { DESIGN, LOCALSTORAGE } from '@/utils/constants';

const passes = ['red', 'orange', 'green', 'purple', 'blue'];

const getPassesFromStorage = () => {
  const passesNow = [];

  if (Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) === 0) return ['blue']; // for sandbox
  else {
    passes.forEach((pass) => {
      if (Number(localStorage.getItem(LOCALSTORAGE[`PASS${pass.toUpperCase()}`])) === 1) passesNow.push(pass);
    });
  }
  return passesNow;
};

const initialState = {
  // scales
  health: Number(localStorage.getItem(LOCALSTORAGE.HEALTH)) || DESIGN.HERO.scales.health.start,
  endurance: Number(localStorage.getItem(LOCALSTORAGE.ENDURANCE)) || DESIGN.HERO.scales.endurance.start,
  ammo: Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) === 0 ? 1000 : Number(localStorage.getItem(LOCALSTORAGE.AMMO)) || DESIGN.HERO.scales.ammo.start,
  weight: Number(localStorage.getItem(LOCALSTORAGE.WEIGHT)) || DESIGN.HERO.scales.weight.start,

  red: Number(localStorage.getItem(LOCALSTORAGE.RED)) || 0,
  orange: Number(localStorage.getItem(LOCALSTORAGE.ORANGE)) || 0,
  green: Number(localStorage.getItem(LOCALSTORAGE.GREEN)) || 0,
  purple: Number(localStorage.getItem(LOCALSTORAGE.PURPLE)) || 0,

  passes: (Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) === DESIGN.LEVELS.start
          // eslint-disable-next-line no-self-compare
          && Number(localStorage.getItem(LOCALSTORAGE.LEVELFROM)) <= Number(localStorage.getItem(LOCALSTORAGE.LEVEL)))
          || (Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) === DESIGN.LEVELS.start
              && Number(localStorage.getItem(LOCALSTORAGE.LEVELFROM)) === DESIGN.LEVELS.start
              && Number(localStorage.getItem(LOCALSTORAGE.PASSRED)) === 1)
    ? []
    : getPassesFromStorage(),

  isHeroOnUpgrade: false,
  isHeroOnDamage: false,
  isHeroOnHit: false,

  isHeroTired: false,

  isOptical: false,

  // Эффекты от цветов
  isNotDamaged: false,
  isNotTired: false,
  isTimeMachine: false,
  isGain: false,

  directionX: Number(localStorage.getItem(LOCALSTORAGE.DIRECTIONX)) || DESIGN.HERO.START[`level${Number(localStorage.getItem(LOCALSTORAGE.LEVEL))}`].start.direction.x,
  directionY: Number(localStorage.getItem(LOCALSTORAGE.DIRECTIONY)) || DESIGN.HERO.START[`level${Number(localStorage.getItem(LOCALSTORAGE.LEVEL))}`].start.direction.y,
  directionZ: Number(localStorage.getItem(LOCALSTORAGE.DIRECTIONZ)) || DESIGN.HERO.START[`level${Number(localStorage.getItem(LOCALSTORAGE.LEVEL))}`].start.direction.z,
};

const state = initialState;

const getters = {
  health: state => state.health,
  endurance: state => state.endurance,
  ammo: state => state.ammo,
  weight: state => state.weight,

  red: state => state.red,
  orange: state => state.orange,
  green: state => state.green,
  purple: state => state.purple,

  passes: state => state.passes,

  isHeroOnUpgrade: state => state.isHeroOnUpgrade,
  isHeroOnDamage: state => state.isHeroOnDamage,
  isHeroOnHit: state => state.isHeroOnHit,

  isHeroTired: state => state.isHeroTired,

  isOptical: state => state.isOptical,

  isNotDamaged: state => state.isNotDamaged,
  isNotTired: state => state.isNotTired,
  isTimeMachine: state => state.isTimeMachine,
  isGain: state => state.isGain,

  directionX: state => state.directionX,
  directionY: state => state.directionY,
  directionZ: state => state.directionZ,
};

const arrayFields = [
  'passes',
];

const incrementFields = [
  'health',
  'endurance',
  'ammo',
  'weight',

  'red',
  'orange',
  'green',
  'purple',
];

const actions = {
  setScale: ({ commit }, payload) => {
    commit('setScale', payload);
  },
};

const mutations = {
  setScale: (state, payload) => {
    if (payload.field === DESIGN.HERO.scales.health.name
      && state[payload.field] + payload.value > 99.999999) {
      state[payload.field] = 100;
    } else if (payload.field === DESIGN.HERO.scales.endurance.name
      && state[payload.field] + payload.value > 99) {
      state[payload.field] = 100;
      state.isHeroTired = false;
    } else if (arrayFields.includes(payload.field)) {
      if (!state[payload.field].includes(payload.value)) state[payload.field].push(payload.value);
    } else if (incrementFields.includes(payload.field)) {
      // eslint-disable-next-line operator-assignment
      state[payload.field] = state[payload.field] + payload.value;
    } else state[payload.field] = payload.value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
