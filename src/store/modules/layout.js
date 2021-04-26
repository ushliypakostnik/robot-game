import API from '@/utils/api';

/* eslint-disable prefer-destructuring, operator-assignment */
// eslint-disable-next-line import/no-cycle
import storage from '@/utils/storage';

// eslint-disable-next-line import/no-cycle
import {
  isBackend,
  DESIGN,
  LOCALSTORAGE,
} from '@/utils/constants';

const initialState = {
  isFetching: false,
  isUser: !isBackend,

  language: null,

  level: null,
  levelFrom: null,

  isPause: true,

  isModal: false,
  modalId: null,

  messages: [],
  message: 0,

  isGameOver: false,
  isWin: false,
};

if (!isBackend) {
  const autoLevel = Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) || null;
  if (!autoLevel) localStorage.setItem(LOCALSTORAGE.LEVEL, DESIGN.LEVELS.start);

  initialState.level = Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) || DESIGN.LEVELS.start;
  initialState.levelFrom = Number(localStorage.getItem(LOCALSTORAGE.LEVELFROM)) || null;
}

const state = initialState;

const getters = {
  isFetching: state => state.isFetching,
  isUser: state => state.isUser,

  language: state => state.language,

  level: state => state.level,
  levelFrom: state => state.levelFrom,

  isPause: state => state.isPause,

  isModal: state => state.isModal,
  modalId: state => state.modalId,

  messages: state => state.messages,
  message: state => state.message,

  isGameOver: state => state.isGameOver,
  isWin: state => state.isWin,
};

let messages;
let index;

let user;

const isLevelStart = (level) => {
  return !level ? DESIGN.LEVELS.start : level;
};

const actions = {
  setUser: ({ commit }) => {
    commit('setIsFetching', true);
    API.setUser().then((res) => {
      localStorage.setItem(LOCALSTORAGE.ROBOTID, res.data.user.id);

      commit('setLevel', {
        level: isLevelStart(res.data.user.level),
        levelFrom: res.data.user.levelFrom,
      });
      commit('setUser');
      commit('hero/setUser', res.data.user, { root: true });
      commit('setIsFetching', false);
    });
  },

  // eslint-disable-next-line no-unused-vars
  saveUser: ({ commit }, {
    scope,
    isF5,
    level,
    levelFrom,
  }) => {
    user = {
      robotID: localStorage.getItem(LOCALSTORAGE.ROBOTID),

      level,
      levelFrom,

      health: scope.health,
      endurance: scope.endurance,
      ammo: scope.ammo,
      weight: scope.weight,

      red: scope.red,
      orange: scope.orange,
      green: scope.green,
      purple: scope.purple,

      passes: scope.passes,
    };

    if (!isF5 && !scope.isWin) {
      user.directionX = scope.hero.getHeroDirection().x;
      user.directionY = scope.hero.getHeroDirection().y;
      user.directionZ = scope.hero.getHeroDirection().z;
    } else {
      if (levelFrom > level) {
        user.directionX = DESIGN.HERO.START[`level${scope.level}`].end.direction.x;
        user.directionY = DESIGN.HERO.START[`level${scope.level}`].end.direction.y;
        user.directionZ = DESIGN.HERO.START[`level${scope.level}`].end.direction.z;
      } else {
        user.directionX = DESIGN.HERO.START[`level${scope.level}`].start.direction.x;
        user.directionY = DESIGN.HERO.START[`level${scope.level}`].start.direction.y;
        user.directionZ = DESIGN.HERO.START[`level${scope.level}`].start.direction.z;
      }
    }

    commit('setIsFetching', true);
    API.saveUser(user).then((res) => {
      localStorage.setItem(LOCALSTORAGE.ROBOTID, res.data.robotID);
      window.location.reload(true);
    });
  },

  updateUser: ({ commit }, {
    scope,
    isFirst,
    level,
    levelFrom,
  }) => {
    user = {
      robotID: localStorage.getItem(LOCALSTORAGE.ROBOTID),

      level,
      levelFrom,

      health: DESIGN.HERO.scales.health.start,
      endurance: DESIGN.HERO.scales.endurance.start,
      ammo: DESIGN.HERO.scales.ammo.start,
      weight: DESIGN.HERO.scales.weight.start,

      red: 0,
      orange: 0,
      green: 0,
      purple: 0,
    };

    if (isFirst || level === 0) {
      user.passes = [];

      user.directionX = DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.x;
      user.directionY = DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.y;
      user.directionZ = DESIGN.HERO.START[`level${DESIGN.LEVELS.start}`].start.direction.z;
    } else {
      user.passes = scope.passes;

      user.directionX = DESIGN.HERO.START[`level${scope.level}`].start.direction.x;
      user.directionY = DESIGN.HERO.START[`level${scope.level}`].start.direction.y;
      user.directionZ = DESIGN.HERO.START[`level${scope.level}`].start.direction.z;
    }

    commit('setIsFetching', true);
    API.saveUser(user).then((res) => {
      localStorage.setItem(LOCALSTORAGE.ROBOTID, res.data.robotID);
      window.location.reload(true);
    });
  },

  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language);
    storage.rememberLanguage(language);
  },

  // eslint-disable-next-line no-unused-vars
  setLevel: ({ commit }, { level, levelFrom }) => {
    storage.rememberLevel(level, levelFrom);
  },

  togglePause: ({ commit }, isPause) => {
    commit('togglePause', isPause);
  },

  addMessage: ({ commit }) => {
    commit('addMessage');
  },

  // eslint-disable-next-line object-curly-newline
  showMessage: ({ commit }, { id, view, name, data }) => {
    commit('showMessage', { id, view, name, data }); // eslint-disable-line object-curly-newline
  },

  hideMessageByView: ({ commit }, view) => {
    commit('hideMessageByView', view);
  },

  hideMessageById: ({ commit }, id) => {
    commit('hideMessageById', id);
  },

  setModal: ({ commit }, { isModal, modalId }) => {
    commit('setModal', { isModal, modalId });
  },

  setGameOver: ({ commit }) => {
    commit('setGameOver');
  },

  setWin: ({ commit }) => {
    commit('setWin');
  },
};

const mutations = {
  setIsFetching: (state, isFetching) => {
    state.isFetching = isFetching;
  },

  setUser: (state) => {
    state.isUser = true;
  },

  setLevel: (state, { level, levelFrom }) => {
    state.level = level;
    state.levelFrom = levelFrom;
  },

  changeLanguage: (state, language) => {
    state.language = language;
  },

  togglePause: (state, isPause) => {
    state.isPause = isPause;
  },

  addMessage: (state) => {
    state.message = state.message + 1;
  },

  showMessage: (state, { id, view, name, data }) => {
    messages = state.messages;
    messages.push([id, view, name, data]);
    state.messages = messages;
  },

  hideMessageByView: (state, view) => {
    messages = state.messages;
    index = messages.find(message => message[1] === view);
    if (index) messages.splice(messages.indexOf(index), 1);
    state.messages = messages;
  },

  hideMessageById: (state, id) => {
    messages = state.messages;
    index = messages.find(message => message[0] === id);
    if (index) messages.splice(messages.indexOf(index), 1);
    state.messages = messages;
  },

  setModal: (state, { isModal, modalId }) => {
    state.isModal = isModal;
    if (isModal) state.modalId = modalId;
    else state.modalId = null;
  },

  setGameOver: (state) => {
    state.isGameOver = true;
  },

  setWin: (state) => {
    state.isWin = true;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
