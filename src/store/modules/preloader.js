const initialState = {
  isGameLoaded: false,

  // Textures
  isConcrete1Loaded: false,
  isConcrete2Loaded: false,
  isConcrete3Loaded: false,
  isConcrete4Loaded: false,
  isMetall1Loaded: false,
  isMetall2Loaded: false,
  isMetall3Loaded: false,
  isLeaderLoaded: false,
  isSandLoaded: false,
  isFireLoaded: false,
  isPurpleLoaded: false,
  isGreenLoaded: false,
  isGlassLoaded: false,
  isGlassTransparentLoaded: false,
  isGlassTransparentLargeLoaded: false,

  // Models
  isBottleLoaded: false,
  isPotLoaded: false,
  isFlowerLoaded: false,
  isVinometLoaded: false,
  isVinometOpticalLoaded: false,
  isSpiderLoaded: false,
  isDroneLoaded: false,

  // Audio
  isPickLoaded: false,
  isStepsLoaded: false,
  isDamageLoaded: false,
  isHitLoaded: false,
  isDoorsSoundLoaded: false,
  isJumpStartLoaded: false,
  isJumpEndLoaded: false,
  isScreensSoundLoaded: false,
  isShotLoaded: false,
  isExplosionLoaded: false,
  isMechanismLoaded: false,
  isFlyLoaded: false,
  isDeadLoaded: false,

  // World build
  isDoorsBuild: false,
  isLeadersBuild: false,
  isPassesBuild: false,
  isScreensBuild: false,
  isBottlesBuilt: false,
  isFlowersBuilt: false,
  isSpidersBuilt: false,
  isDronesBuilt: false,
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
