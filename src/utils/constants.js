// const isProd = process.env.NODE_ENV === 'production';
// const apiUrl = process.env.VUE_APP_API_URL;
// export const API_URL = isProd ? apiUrl || 'https://???' : apiUrl || 'http://localhost:8082';

export const LOCALSTORAGE = {
  LANGUAGE: 'language',
  LEVEL: 'level',
};

/* export const SESSIONSTORAGE = {
}; */

export const LANGUAGES = [
  { id: 1, name: 'en' },
  { id: 2, name: 'ru' },
];

// World

// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
const size = (s, g) => {
  return s * g / 2 * Math.sqrt(2);
};

export const DESIGN = {
  V: '2',
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    white: 0xffffff,
    black: 0x000000,

    grayDark: 0x555555,
    gray: 0x999999,
    grayLight: 0xaaaaaa,
    grayLight2: 0xdddddd,

    blue: 0x88ccff,
    purple: 0x8267bf,
    purpleDark: 0x413460,
    red: 0xcf3326,
    redDark: 0x681a13,

    sun: 0xffff99,
    lightnings: 0x8267bf,
  },
  WORLD_SIZE: {
    level1: size(1, 200), // размер клетки 200
  },
  VOLUME: {
    small: 0.35,
    normal: 0.5,
    max: 1,
    positional: {
      ref: 50,
      max: 2000,
    },
  },
  GRAVITY: 35,
  MESSAGES_TIMEOUT: 3000,
  ANIMATION_TIMEOUT: 300,
  HERO: {
    HEIGHT: 2, // средний рост челевеческой особи, мужики 1.7, бабы 1.6
    SPEED: 40,
    JUMP: 25,
    START: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
};

export const OBJECTS = {
  LEADER: {
    size: 10,
    level1: {
      position: [
        [-18.9, 9, 8],
      ],
    },
  },
  DOORS: {
    // x, y, z, direction, pass, rotate
    level1: {
      position: [],
    },
  },
  LASERS: {
    size: 1,
    delay: 2,
    // x, y, z, width
    level1: {
      position: [
        [-35, 10, -19, 17], // корридор от старта
        [-55, 10, -19, 17], // корридор от старта
        [-75, 10, -19, 17], // корридор от старта
        [-95, 10, -19, 17], // корридор от старта
        [-115, 10, -19, 17], // корридор от старта
        [-145, 10, -19, 17], // корридор от старта
        [-165, 10, -19, 17], // корридор от старта
      ],
    },
  },
  LAMPS: {
    level1: {
      // x, y, z, intensity, distance
      position: [
        [-5, 10, 9, 1.5, 20], // стартовая позиция
        [-5, 10, -6, 1.5, 20], // стартовая позиция
        [-38, 10, -10, 1.5, 20], // корридор от старта
      ],
    },
  },
};

export const LOCALES = {
  [LANGUAGES[0].name]: {
    layout: {
      title: 'Drinkin Robot',
      level: 'Level',
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
      title: 'Робот-собутыльник',
      level: 'Уровень',
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
