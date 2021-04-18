/* eslint-disable prefer-destructuring, operator-assignment */
// eslint-disable-next-line import/no-cycle
import storage from '@/utils/storage';

// eslint-disable-next-line import/no-cycle
import { DESIGN, LOCALSTORAGE } from '@/utils/constants';

const autoLevel = Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) || null;
if (!autoLevel) localStorage.setItem(LOCALSTORAGE.LEVEL, DESIGN.LEVELS.start);

const initialState = {
  language: null,
  level: Number(localStorage.getItem(LOCALSTORAGE.LEVEL)) || DESIGN.LEVELS.start,
  levelFrom: Number(localStorage.getItem(LOCALSTORAGE.LEVELFROM)) || null,

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

const actions = {
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
