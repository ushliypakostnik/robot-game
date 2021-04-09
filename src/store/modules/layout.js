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

  isModal: false,
  modalId: null,

  messages: [],
  message: 0,

  isGameOver: false,
  isWin: false,
};

const state = initialState;

const getters = {
  language: state => state.language,
  level: state => state.level,

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
