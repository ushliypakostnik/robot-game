const initialState = {
  isGameLoaded: false,

  isConcrete1Loaded: false,
  isConcrete2Loaded: false,
  isConcrete3Loaded: false,
  isConcrete4Loaded: false,
  isMetall1Loaded: false,
  isMetall2Loaded: false,
  isMetall3Loaded: false,
  isLeaderLoaded: false,
  isSandLoaded: false,

  isDoorsBuild: false,
  isLeadersBuild: false,
};

const state = initialState;

let stateCopy;
let result;

const getters = {
  isGameLoaded: state => state.isGameLoaded,
};

const actions = {
  preloadOrBuilt: ({ commit }, field) => {
    commit('preloadOrBuilt', field);
  },

  isAllLoadedAndBuilt: ({ commit }) => {
    commit('isAllLoadedAndBuilt');
  },
};

const mutations = {
  preloadOrBuilt: (state, field) => {
    state[field] = true;
  },

  isAllLoadedAndBuilt: (state) => {
    stateCopy = Object.assign({}, state);
    delete stateCopy.isGameLoaded;
    result = Object.values(stateCopy).every(field => field === true);
    if (result) state.isGameLoaded = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
