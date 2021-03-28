/* eslint-disable prefer-destructuring, operator-assignment */
// eslint-disable-next-line import/no-cycle
import storage from '@/utils/storage';

// eslint-disable-next-line import/no-cycle
import { LOCALSTORAGE } from '@/utils/constants';

const AUTO_LEVEL = localStorage.getItem(LOCALSTORAGE.LEVEL) || null;
if (!AUTO_LEVEL) {
  storage.rememberLevel(1);
}

const initialState = {
  language: null,
  level: localStorage.getItem(LOCALSTORAGE.LEVEL) || 1,
  isPause: true,

  messages: [],
  message: 0,
};

const state = initialState;

const getters = {
  language: state => state.language,
  level: state => state.level,
  isPause: state => state.isPause,
  messages: state => state.messages,
  message: state => state.message,
};

let messages;
let index;

const actions = {
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language);
    storage.rememberLanguage(language);
  },

  setLevel: ({ commit }, level) => {
    commit('setLevel', level);
    storage.rememberLevel(level);
  },

  togglePause: ({ commit }, isPause) => {
    commit('togglePause', isPause);
  },

  addMessage: ({ commit }) => {
    commit('addMessage');
  },

  showMessage: ({ commit }, { id, view, name, data }) => {
    commit('showMessage', { id, view, name, data });
  },

  hideMessageByView: ({ commit }, view) => {
    commit('hideMessageByView', view);
  },

  hideMessageById: ({ commit }, id) => {
    commit('hideMessageById', id);
  },
};

const mutations = {
  changeLanguage: (state, language) => {
    state.language = language;
  },

  setLevel: (state, level) => {
    state.level = level;
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
