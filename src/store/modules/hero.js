import { DESIGN } from '@/utils/constants';

const initialState = {
  // scales
  health: DESIGN.HERO.scales.health.start,
  endurance: DESIGN.HERO.scales.endurance.start,
  ammo: DESIGN.HERO.scales.ammo.start,

  anemone: 0,
  crocus: 0,
  daffodil: 0,
  tulip: 0,

  // passes: [],
  passes: ['red', 'orange', 'green', 'purple'],

  isHeroOnUpgrade: false,
  isHeroOnDamage: false,
  isHeroOnHit: false,

  isHeroTired: false,

  isNotDamaged: false,
  isNotTired: false,
};

const state = initialState;

const getters = {
  health: state => state.health,
  endurance: state => state.endurance,
  ammo: state => state.ammo,

  anemone: state => state.anemone,
  crocus: state => state.crocus,
  daffodil: state => state.daffodil,
  tulip: state => state.tulip,

  passes: state => state.passes,

  isHeroOnUpgrade: state => state.isHeroOnUpgrade,
  isHeroOnDamage: state => state.isHeroOnDamage,
  isHeroOnHit: state => state.isHeroOnHit,

  isHeroTired: state => state.isHeroTired,

  isNotDamaged: state => state.isNotDamaged,
  isNotTired: state => state.isNotTired,
};

const actions = {
  setHeroOnDamage: ({ commit }, isHeroOnDamage) => {
    commit('setHeroOnDamage', isHeroOnDamage);
  },

  setHeroOnHit: ({ commit }, isHeroOnHit) => {
    commit('setHeroOnHit', isHeroOnHit);
  },

  setHeroTired: ({ commit }, isHeroTired) => {
    commit('setHeroTired', isHeroTired);
  },

  setNotDamaged: ({ commit }, isNotDamaged) => {
    commit('setNotDamaged', isNotDamaged);
  },

  setNotTired: ({ commit }, isNotTired) => {
    commit('setNotTired', isNotTired);
  },

  setHeroOnUpgrade: ({ commit }, isHeroOnUpgrade) => {
    commit('setHeroOnUpgrade', isHeroOnUpgrade);
  },

  setScale: ({ commit }, payload) => {
    commit('setScale', payload);
  },

  addPass: ({ commit }, pass) => {
    commit('addPass', pass);
  },
};

const mutations = {
  setHeroOnDamage: (state, isHeroOnDamage) => {
    state.isHeroOnDamage = isHeroOnDamage;
  },

  setHeroOnHit: (state, isHeroOnHit) => {
    state.isHeroOnHit = isHeroOnHit;
  },

  setHeroTired: (state, isHeroTired) => {
    state.isHeroTired = isHeroTired;
  },

  setNotDamaged: (state, isNotDamaged) => {
    state.isNotDamaged = isNotDamaged;
  },

  setNotTired: (state, isNotTired) => {
    state.isNotTired = isNotTired;
  },

  setHeroOnUpgrade: (state, isHeroOnUpgrade) => {
    state.isHeroOnUpgrade = isHeroOnUpgrade;
  },

  setScale: (state, payload) => {
    if (payload.field === DESIGN.HERO.scales.health.name
      && state[payload.field] + payload.value > 99.999999) {
      state[payload.field] = 100;
    } else if (payload.field === DESIGN.HERO.scales.endurance.name
      && state[payload.field] + payload.value > 99) {
      state[payload.field] = 100;
      state.isHeroTired = false;
      // eslint-disable-next-line operator-assignment
    } else state[payload.field] = state[payload.field] + payload.value;
  },

  addPass: (state, pass) => {
    if (!state.passes.includes(pass)) state.passes.push(pass);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
