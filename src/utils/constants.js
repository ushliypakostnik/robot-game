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

// Количество реальных объектов-капель в обойме вино-оружия
const ammo = 25;

export const DESIGN = {
  V: '2.1.3',
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    white: 0xffffff,
    black: 0x000000,

    grayDark: 0x555555,
    grayDarken: 0x222222,
    gray: 0x999999,
    grayLight: 0xaaaaaa,
    grayLight2: 0xdddddd,

    blue: 0x88ccff,
    purple: 0x8267bf,
    purpleDark: 0x413460,
    red: 0xcf3326,
    redDark: 0x681a13,
    green: 0x4cbb17,
    greenDark: 0x265e0b,
    greenDark2: 0x132f06,
    greenDark3: 0x013220,
    greenDark4: 0x011A11,
    orange: 0xf9a602,
    orangeDark: 0x7d5301,
    yellow: 0xf0cf08,
    yellowDark: 0xb49b06,

    sun: 0xffff99,
  },
  WORLD_SIZE: {
    level1: size(1, 200), // размер клетки 200
  },
  VOLUME: {
    small: 0.25,
    normal: 0.5,
    max: 0.75,
    positional: {
      ref: 50,
      max: 2000,
    },
    hero: {
      pick: 0.15,
      step: 0.2,
      run: 0.45,
      current: 0.4,
      jumpstart: 0.7,
      jumpend: 0.2,
    },
    wind: 0.2,
    doors: 0.9,
    screen: 0.3,
  },
  GRAVITY: 35,
  MESSAGES_TIMEOUT: 3000,
  ANIMATION_TIMEOUT: 300,
  CHECK: 10,
  HERO: {
    HEIGHT: 2, // средний рост челевеческой особи, мужики 1.7, бабы 1.6
    SPEED: 40,
    JUMP: 25,
    CAST: 10,
    START: {
      level1: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    scales: {
      health: {
        name: 'health',
        start: 100,
      },
      endurance: {
        name: 'endurance',
        start: 100,
      },
      ammo: {
        name: 'ammo',
        start: 0,
        objects: ammo,
      },
    },
  },
  PASSES: {
    red: 'red',
    orange: 'orange',
    green: 'green',
    purple: 'purple',
    blue: 'blue',
  },
  FLOWERS: {
    red: 'red',
    orange: 'orange',
    green: 'green',
    purple: 'purple',
  },
  EFFECTS: {
    time: { // длительность спецэффектов от цветов
      health: 15,
      endurance: 15,
      machine: 15,
      gain: 15,
    },
    red: {
      health: 20,
    },
    orange: {
      health: 40,
    },
    green: {
      health: 60,
    },
    purple: {
      health: 40,
    },
    bottle: {
      ammo: ammo * 4,
    },
  },
  STAFF: {
    mode: {
      idle: 'idle',
      active: 'active',
      thing: 'thing',
    },
  },
};

export const OBJECTS = {
  DOORS: {
    name: 'door',
    speed: 15,
    pause: 3,
  },
  LEADER: {
    name: 'leader',
    size: 10,
  },
  PASSES: {
    name: 'pass',
    size: 1,
  },
  SCREENS: {
    name: 'screen',
    size: 1,
  },
  FLOWERS: {
    name: 'flower',
  },
  BOTTLES: {
    name: 'bottle',
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
      gameover: 'GAME OVER',
      win: `MISSION<br />COMPLETED`,
      gameovebuttonStart: 'Start over',
      gameovebuttonNext: 'Next level',
      author: 'Author: ',
      authorlink: 'ushliypakostnik',

      controls: 'Controls',
      control1: 'Shot: Mouse click',
      control2: 'Move: WASD / Arrows',
      control3: 'Jump: Space + WASD / Arrows',
      control4: 'Run: Shift + W',
      control5: 'Hidden movement: C or Alt',
      control6: 'Look: Mouse',
      control7: 'Take a thing / Open door : E',
      control8: 'Apply flower: 1234',
      control9: 'Tourch: T',
      control10: 'Pause: P',

      legend: 'Legend',
      legendtext: `Earth, distant future. People a long time ago killed each other in nuclear wars, finding out who is right, who is left, who white, and who is red and so on. Several races bred on unbombed atolls in the Pacific Ocean humanoid robots. For example, more human-like, imitating organic, bisexual and personal relationships Drinking companions, which transform animals and vegetation into life force and special effects. Inside them, through thin strong tubes, a special a fermented organic mix similar to human wine, setting them in motion. Or more machine-like same-sex Cyber ​​Dancers preaching meditative Zen-Noise. Gender and religious differences between cultures, of course, raged a fierce war.<br /><br />A couple of young drinking buddies set off on a honeymoon trip across the ocean. But the boat suddenly started leaking and they barely made it to the nearest atoll. The island, beautiful at first glance, turned out to be a dangerous trap, as it had long been chosen for meditation by the Dancers. The stronghold is well prepared for defense - the entire territory is mined, heavy artillery has been brought in, and cover combat drones have been launched to control the airspace.<br /><br />The Robot Drinker wakes up on the floor of the torture chamber of the same-sex prison ... The tanks are empty ... His tormentors apparently decided that he was no longer a tenant and left him to die ... On the wall there is a portrait of the legendary Last President - the ideological forerunner and idol of the Dancers - a man who once unleashed the last war in the history of mankind ...`,

      rules: 'Rules',
    },
    levels: {
      level1: 'Prison Break Democracy',
    },
    messages: {
      message1: {
        toruchOn: 'Flashlight lit',
        toruchOff: 'Flashlight extinguished',
        tired: 'The robot is tired of running',
        recovered: 'The robot can run again',
        hiddenMoveEnabled: 'The robot moves in stealth mode',
        hiddenMoveDisabled: 'Stealth mode disabled',
        startNoDamaged: `The robot is invulnerable for ${DESIGN.EFFECTS.time.health} seconds!`,
        startNoTired: `The robot will not get tired of running ${DESIGN.EFFECTS.time.endurance} seconds!`,
        endNoDamaged: 'The invulnerability effeect is over',
        endNoTired: 'The robot gets tired of running again',
        startTimeMachine: `The robot used a portable time machine!<br />He has ${DESIGN.EFFECTS.time.machine} seconds.`,
        startGain: `The robot threw itself a purple gain!<br />The power of the weapon has increased by ${DESIGN.EFFECTS.time.gain} seconds!`,
        endTimeMachine: 'Time acceleration effect is over!',
        endGain: 'The effect of the pumped wine cannon is over!',
        pick: 'The robot picked up: ',
        pickBottle: 'Wine tank refilled!',
      },
      message2: {
        open: 'Open door?',
        closed: {
          closed1: 'Requires ',
          closed2: ' access level',
        },
        cast: 'Pick up: ',
        look: 'Look at: ',
      },
      message3: {
        enemiesBeside: `Enemies spotted nearby!<br />The robot should be careful!`,
        notEnemiesBeside: 'No one around...',
        discovered: 'The robot disturbed ',
      },
    },
    objects: {
      screen: {
        name: 'dashboard',
        declination: 'dashboard',
      },
      pass: {
        name: ' pass',
        red: 'red',
        orange: 'orange',
        green: 'green',
        purple: 'purple',
        blue: 'blue',
      },
      flower: {
        name: ' flower',
        red: {
          name: 'red',
          text: `: gives up to ${DESIGN.EFFECTS.red.health}% health<br />and ${DESIGN.EFFECTS.time.health} seconds the robot is invulnerable.`,
        },
        orange: {
          name: 'orange',
          text: `: gives up to ${DESIGN.EFFECTS.orange.health}% health,<br />increases speed and jump height. ${DESIGN.EFFECTS.time.endurance} seconds<br />the robot does not get tired of running.`,
        },
        green: {
          name: 'green',
          text: `: grants up to ${DESIGN.EFFECTS.green.health}% health<br />and activates the Portable Time Machine<br />for ${DESIGN.EFFECTS.time.machine} seconds.`,
        },
        purple: {
          name: 'purple',
          text: `: Gives up to ${DESIGN.EFFECTS.purple.health}% health<br />and increases damage power for ${DESIGN.EFFECTS.time.gain} seconds.`,
        },
      },
      bottle: {
        name: 'bottle',
        declination: 'bottle',
        text: `: contains ${DESIGN.EFFECTS.bottle.ammo} drops`,
      },
    },
    modals: {
      modal1: {
        text1: 'The USA brought freedom and democracy to all peoples, more and more persistently and mercilessly. Trampling on sovereign governments, devouring industry and resources, leaving behind mountains of corpses and rivers of blood, rahrukha, civil war, famine, many thousands of refugees, broken destinies of generations ... <br /> <br /> One fine day, the Congress of the Democratic Party banned the Republicans by unanimous vote, declaring President for Life ...',
        text2: 'The old body refused and the nano-surgeons changed the dying organs over and over again. At some point, there were more implants than organic matter. And one morning, it pressed the Button ... Now no one knows exactly why it did it, but after a few hours the number of people decreased many times ... <br /> <br /> Besides, it started very soon Global Dehumidification Program.',
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
      gameover: 'КОНЕЦ ИГРЫ',
      win: `МИССИЯ<br />ВЫПОЛНЕННА`,
      gameovebuttonStart: 'Начать сначала',
      gameovebuttonNext: 'Следующий уровень',
      author: 'Автор: ',
      authorlink: 'ushliypakostnik',

      controls: 'Управление',
      control1: 'Выстрел: Кнопки мыши',
      control2: 'Движение: WASD / Стрелки',
      control3: 'Прыжок: Space + WASD / Стрелки',
      control4: 'Бежать: Shift + W',
      control5: 'Cкрытное передвижение: C или Alt',
      control6: 'Осмотреться: Мышь',
      control7: 'Взять предмет / Открыть дверь: Е',
      control8: 'Применить цветок: 1234',
      control9: 'Фонарик: T',
      control10: 'Пауза: P',

      legend: 'Легенда',
      legendtext: `Земля, далекое будущее. Люди давным-давно перебили друг-друга в ядерных войнах, выясняя кто правый, кто левый, кто белый, а кто красный и прочее. На не затронутых бомбардировками атоллах в Тихом Океане размножилось несколько рас человекоподобных роботов. Например, более человекоподобные, имитирующие органику, двуполость и личные отношения Собутыльники, которые перерабатывают животных и растительность в жизненную силу и спецэффекты. Внутри них, по тонким крепким трубкам, течет специальный сброженный органический микс, схожий с человеческим вином, приводя их в движение. Или более машиноподбные однополые Кибер-Танцоры, проповедующие медитативный Дзинь-Нойз. На почве гендерных и религиозных разногласий между культурами, конечно же, понеслась жестокая война.<br /><br />Пара молодых Собутыльников отправились в свадебное путешествие по океану. Но катер внезапно дал течь и они с трудом дотянули до ближайшего атолла. Прекрасный на первый взгляд остров оказался опасной ловушкой, так как был давно облюбован для медитаций Танцорами. Оплот хорошо подготовлен к обороне - вся территория заминирована, завезена тяжелая артиллерия, запущены боевые дроны прикрытия, контролирующие воздушное пространство...<br /><br />Робот-Собутыльник приходит в себя на полу пыточной камеры тюрьмы Однополых... Баки пусты... Его мучители, видимо, решили что он уже не жилец, и оставили подыхать... На стене висит портрет легендарного Последнего Президента - идеологического предтечи и кумира Танцоров - человека, когда-то развязавшего последнюю в истории человечества войну...`,

      rules: 'Правила',
    },
    levels: {
      level1: 'Побег из тюрьмы Демократии',
    },
    messages: {
      message1: {
        toruchOn: 'Фонарик включен',
        toruchOff: 'Фонарик выключен',
        tired: 'Робот устал от бега',
        recovered: 'Робот снова может бегать',
        hiddenMoveEnabled: 'Робот двигается в скрытном режиме',
        hiddenMoveDisabled: 'Скрытный режим отключен',
        startNoDamaged: `Робот получил неуязвимость на ${DESIGN.EFFECTS.time.health} секунд!`,
        startNoTired: `Робот не будет уставать от бега ${DESIGN.EFFECTS.time.endurance} секунд!`,
        endNoDamaged: 'Эффект неуязвимости закончился',
        endNoTired: 'Робот снова устает от бега',
        startTimeMachine: `Робот включил портативную машину времени!<br />У него есть ${DESIGN.EFFECTS.time.machine} секунд.`,
        startGain: `Робот задвинулся пурпурным драйвом!<br />Сила оружия выросла на ${DESIGN.EFFECTS.time.gain} секунд!`,
        endTimeMachine: 'Эффект ускорения времени закончился!',
        endGain: 'Эффект прокаченного виномета закончился!',
        pick: 'Робот подобрал: ',
        pickBottle: 'Бак с вином пополнен!',
      },
      message2: {
        open: 'Открыть дверь?',
        closed: {
          closed1: 'Требуется ',
          closed2: ' уровень доступа',
        },
        cast: 'Подобрать: ',
        look: 'Смотреть: ',
      },
      message3: {
        enemiesBeside: `Рядом замечены враги!<br/>Роботу стоит быть осторожнее!`,
        notEnemiesBeside: 'Рядом никого...',
        discovered: 'Робот потревожил',
      },
    },
    objects: {
      screen: {
        name: 'информационная панель',
        declination: 'информационную панель',
      },
      pass: {
        name: ' пропуск',
        red: 'красный',
        orange: 'оранжевый',
        green: 'зеленый',
        purple: 'фиолетовый',
        blue: 'голубой',
      },
      flower: {
        name: ' цветок',
        red: {
          name: 'красный',
          text: `: дает до  ${DESIGN.EFFECTS.red.health}% здоровья<br />и ${DESIGN.EFFECTS.time.health} cекунд робот неуязвим.`,
        },
        orange: {
          name: 'оранжевый',
          text: `: дает до ${DESIGN.EFFECTS.orange.health}% здоровья,<br />увеличивает скорость и высоту прыжка.<br .>${DESIGN.EFFECTS.time.endurance} секунд робот не устает от бега.`,
        },
        green: {
          name: 'зеленый',
          text: `: дает до ${DESIGN.EFFECTS.green.health}% здоровья<br />и на ${DESIGN.EFFECTS.time.machine} секунд включает портативную машину времени.`,
        },
        purple: {
          name: 'фиолетовый',
          text: `: дает до ${DESIGN.EFFECTS.purple.health}% здоровья<br />и на ${DESIGN.EFFECTS.time.gain} секунд увеличивает силу урона.`,
        },
      },
      bottle: {
        name: 'бутылка вина',
        declination: 'бутылку вина',
        text: `: cодержит ${DESIGN.EFFECTS.bottle.ammo} капель`,
      },
    },
    modals: {
      modal1: {
        text1: 'США несли свободу и демократию всем народам, все более и более настойчиво и беспощадно. Топча суверенные правительства, пожирая промышленность и ресурсы, оставляя после себя горы трупов и реки крови, разруху, гражданскую войну, голод, многие тысячи беженцев, поломанные судьбы поколений...<br /><br />В один прекрасный день Съезд Демократической Партии единогласным голосаванием запретил Республиканцев, объявив Пожизненного Презиента...',
        text2: 'Старое тело отказывало и нано-хирурги раз за разом меняли отмирающие органы. В какой-то момент имплантов стало больше чем органической материи. И однажды утром, оно нажало Кнопку... Никто теперь не знает точно, зачем оно это сделало, но уже через несколько часов людей стало во много раз меньше....<br /><br />Кроме того, очень скоро стартовала Глобальная Программа Поголовного Расчеловачивания.',
      },
    },
  },
};
