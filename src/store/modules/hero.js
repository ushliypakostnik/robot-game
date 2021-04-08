import { DESIGN } from '@/utils/constants';

const initialState = {
  // scales
  health: DESIGN.HERO.scales.health.start,
  endurance: DESIGN.HERO.scales.endurance.start,
  ammo: DESIGN.HERO.scales.ammo.start,

  red: 0,
  orange: 0,
  green: 0,
  purple: 0,

  // passes: [],
  passes: ['red', 'orange', 'green', 'purple'],

  isHeroOnUpgrade: false,
  isHeroOnDamage: false,
  isHeroOnHit: false,

  isHeroTired: false,

  // Эффекты от цветов
  isNotDamaged: false,
  isNotTired: false,
  isTimeMachine: false,
  isGain: false,
};

const state = initialState;

const getters = {
  health: state => state.health,
  endurance: state => state.endurance,
  ammo: state => state.ammo,

  red: state => state.red,
  orange: state => state.orange,
  green: state => state.green,
  purple: state => state.purple,

  passes: state => state.passes,

  isHeroOnUpgrade: state => state.isHeroOnUpgrade,
  isHeroOnDamage: state => state.isHeroOnDamage,
  isHeroOnHit: state => state.isHeroOnHit,

  isHeroTired: state => state.isHeroTired,

  isNotDamaged: state => state.isNotDamaged,
  isNotTired: state => state.isNotTired,
  isTimeMachine: state => state.isTimeMachine,
  isGain: state => state.isGain,
};

const arrayFields = [
  'passes',
];

const notIncrementFields = [
  'isHeroOnUpgrade',
  'setHeroOnDamage',
  'isHeroOnHit',
  'isHeroTired',
  'isNotDamaged',
  'isNotTired',
  'isTimeMachine',
  'isGain',
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
    } else if (notIncrementFields.includes(payload.field)) {
      state[payload.field] = payload.value;
      // eslint-disable-next-line operator-assignment
    } else state[payload.field] = state[payload.field] + payload.value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
