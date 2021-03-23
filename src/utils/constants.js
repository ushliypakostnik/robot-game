// const isProd = process.env.NODE_ENV === 'production';
// const apiUrl = process.env.VUE_APP_API_URL;
// export const API_URL = isProd ? apiUrl || 'https://???' : apiUrl || 'http://localhost:8082';

export const LOCALSTORAGE = {
  LANGUAGE: 'language',
};

/* export const SESSIONSTORAGE = {
}; */

export const LANGUAGES = [
  { id: 1, name: 'en' },
  { id: 2, name: 'ru' },
];

// Auto language
export const AUTO_LANG = localStorage.getItem(LOCALSTORAGE.LANGUAGE) || null;

// World

// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
const size = (size) => {
  return size * 2000;
};

export const DESIGN = {
  V: '0.1.0',
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    primary0x: 0x621211,
    fog0x: 0x615ebc,
    background0x: 0x88ccff,
    white0x: 0xffffff,
    black0x: 0x111111,
  },
  GROUND_SIZE: size(1),
  VOLUME: {
    small: 0.35,
    normal: 0.5,
    max: 1,
    positional: {
      ref: 50,
      max: 2000,
    },
  },
  GRAVITY: 30,
  MESSAGES_TIMEOUT: 3000,
  ANIMATION_TIMEOUT: 300,
  HERO: {
    HEIGHT: 1.65, // средний рост челевеческой особи, мужики 1.7, бабы 1.6
    SPEED: 25,
    JUMP: 15,
  },
};

export const OBJECTS = {
};

export const LOCALES = {
  [LANGUAGES[0].name]: {
    layout: {
      text0: 'Game name',
      startbutton: 'Play',
      attention: 'Attention!!! It is recommended to play on computers with a powerful video card.',
      gadgetsgate: 'You need a PC keyboard to play',
      chromegate: 'In order to play, open in the Google Chrome (or Yandex) browser',
    },
    messages: {
      message1: 'Permanent message:',
      message2: {
        message1: 'Numbered message 1 text',
      },
    },
  },
  [LANGUAGES[1].name]: {
    layout: {
      text0: 'Название игры',
      startbutton: 'Играть',
      attention: 'Внимание!!! Рекомендуется играть на компьютерах с производительной видеокартой.',
      gadgetstext: 'Для того чтобы играть нужна клавиатура персонального компьютера',
      chromegate: 'Для того чтобы играть откройте в браузере Google Chrome (или Яндекс)',
    },
    messages: {
      message1: 'Постоянное сообщение:',
      message2: {
        message1: 'Нумерованное сообщение 1 текст',
      },
    },
  },
};
