// const isProd = process.env.NODE_ENV === 'production';
// const apiUrl = process.env.VUE_APP_API_URL;
// export const API_URL = isProd ? apiUrl || 'https://???' : apiUrl || 'http://localhost:8082';

export const LOCALSTORAGE = {
  LANGUAGE: 'language',
  LEVEL: 'level',
  LEVELFROM: 'levelFrom',

  HEALTH: 'health',
  ENDURANCE: 'endurance',
  AMMO: 'ammo',
  WEIGHT: 'weight',

  RED: 'red',
  ORANGE: 'orange',
  GREEN: 'green',
  PURPLE: 'purple',

  PASSRED: 'passRed',
  PASSORANGE: 'passOrange',
  PASSGREEN: 'passGreen',
  PASSPURPLE: 'passPurple',
  PASSBLUE: 'passBlue',

  DIRECTIONX: 'directionX',
  DIRECTIONY: 'directionY',
  DIRECTIONZ: 'directionZ',
};

/* export const SESSIONSTORAGE = {
}; */

export const LANGUAGES = [
  { id: 1, name: 'en' },
  { id: 2, name: 'ru' },
];


// World

// Количество реальных объектов-капель в обойме вино-оружия
const ammo = 25;

export const DESIGN = {
  V: '2.46',
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
    redDark2: 0x680913,
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
  LEVELS: {
    start: 1,
  },
  // размер клетки
  WORLD_SIZE: {
    level0: 200,
    level1: 200,
    level2: 200,
    level3: 200,
    level4: 200,
    level5: 200,
  },
  CAMERA: {
    fov: 80,
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
      shot: 0.3,
    },
    wind: 0.2,
    doors: 0.9,
    screen: 0.3,
    explosion: 1,
    mechanism: 0.4,
    fly: 0.8,
    dead: 0.6,
  },
  GRAVITY: 35,
  MESSAGES_TIMEOUT: 3000,
  ANIMATION_TIMEOUT: 300,
  OCTREE_UPDATE_TIMEOUT: 1,
  CHECK: 10,
  WEAPON: {
    speed: 2.5,
    damage: {
      shot: 15,
      explosion: 10,
    },
  },
  SCALES: {
    width: 2,
    height: 0.1,
  },
  HERO: {
    HEIGHT: 3, // средний рост челевеческой особи, мужики 1.7, бабы 1.6
    SPEED: 30,
    JUMP: 25,
    CAST: 10,
    MAXWEIGHT: 25,
    START: {
      level0: {
        start: {
          direction: {
            x: -0.7071067758832469,
            y: 0,
            z: 0.7071067864898483,
          },
          x: 0,
          y: 0,
          z: 150,
        },
      },
      level1: {
        start: {
          direction: {
            x: -0.7071067758832469,
            y: 0,
            z: 0.7071067864898483,
          },
          x: 0,
          y: 0,
          z: 0,
        },
        end: {
          direction: {
            x: -0.0010486213482048862,
            y: 0,
            z: -0.24999780077686298,
          },
          x: -90,
          y: 0,
          z: 19,
        },
      },
      level2: {
        start: {
          direction: {
            x: 0.019630233032196392,
            y: 0,
            z: 0.24922811629329,
          },
          x: -90,
          y: 0,
          z: 25,
        },
        end: {
          direction: {
            x: 0.24943954600815713,
            y: 0,
            z: -0.01673059733674977,
          },
          x: 15,
          y: 0,
          z: 68,
        },
      },
      level3: {
        start: {
          direction: {
            x: 0.24801200940632864,
            y: 0,
            z: 0.031464951775509994,
          },
          x: 21,
          y: 0,
          z: 68,
        },
        end: {
          direction: {
            x: -0.004645598369382121,
            y: 0,
            z: 0.24995683310481914,
          },
          x: 168,
          y: 0,
          z: 51,
        },
      },
      level4: {
        start: {
          direction: {
            x: -0.007251280496195885,
            y: 0,
            z: -0.24989481573487168,
          },
          x: 168,
          y: 0,
          z: 45,
        },
        end: {
          direction: {
            x: -0.007251280496195885,
            y: 0,
            z: -0.24989481573487168,
          },
          x: 168,
          y: 0,
          z: -70,
        },
      },
      level5: {
        start: {
          direction: {
            x: -0.007251280496195885,
            y: 0,
            z: -0.24989481573487168,
          },
          x: 168,
          y: 0,
          z: -77,
        },
      },
    },
    weapon: {
      radius: 0.5,
      quantity: 20,
      damage: 0.75,
      speed: 75,
    },
    recoil: {
      player: 50,
      weapon: 2,
      optical: 100,
      shot: 50,
      enemies: 10,
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
      weight: {
        name: 'weight',
        start: 0,
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
      health: 30,
      weight: 4,
    },
    orange: {
      health: 60,
      weight: 1,
    },
    green: {
      health: 50,
      weight: 2,
    },
    purple: {
      health: 40,
      weight: 3,
    },
    bottle: {
      ammo: ammo * 8,
      weight: 1,
    },
  },
  STAFF: {
    mode: {
      idle: 'idle',
      active: 'active',
      dies: 'dies',
      dead: 'dead',
    },
  },
  ENEMIES: {
    spider: {
      decision: {
        enjoy: 60,
        rotate: 10,
        shot: 20,
        jump: 75,
        speed: 20,
        bend: 30,
      },
    },
    drone: {
      decision: {
        enjoy: 50,
        rotate: 10,
        shot: 20,
        fly: 40,
        speed: 15,
        bend: 25,
      },
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
  SPIDERS: {
    name: 'spider',
    size: 4,
    speed: 3,
    distance: 12, // дистанция ближе которой не двигаются на героя
    jump: 25,
  },
  DRONES: {
    name: 'drone',
    size: 4,
    speed: 6,
    distance: 20, // дистанция ближе которой не двигаются на героя
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
      gameovebuttonStart: 'Start location',
      gameovebuttonStartFirst: 'First location',
      gameovebuttonNext: 'Next level',
      author: 'Author: ',
      authorlink: 'ushliypakostnik',

      controls: 'Controls',
      control1: 'Shot: Left mouse button',
      control2: 'Move: WASD / Arrows',
      control3: 'Jump: Space + WASD / Arrows',
      control4: 'Run: Shift + W',
      control5: 'Hidden movement: C or Alt',
      control6: 'Look: Mouse',
      control7: 'Take a thing / Open door : E',
      control8: 'Optical sight: Right mouse button',
      control9: 'Apply flower: 1234',
      control10: 'Tourch: T',
      control11: 'Pause: P',

      legend: 'Legend',
      legendtext: `Earth, distant future. People a long time ago killed each other in nuclear wars, finding out who is right, who is left, who white, and who is red and so on. Several races bred on unbombed atolls in the Pacific Ocean humanoid robots. For example, more human-like, imitating organic, bisexual and personal relationships Drinking companions, which transform animals and vegetation into life force and special effects. Inside them, through thin strong tubes, a special a fermented organic mix similar to human wine, setting them in motion. Or more machine-like same-sex Cyber ​​Dancers preaching meditative Zen-Noise. Gender and religious differences between cultures, of course, raged a fierce war.<br /><br />A couple of young drinking buddies set off on a honeymoon trip across the ocean. But the boat suddenly started leaking and they barely made it to the nearest atoll. The island, beautiful at first glance, turned out to be a dangerous trap, as it had long been chosen for meditation by the Dancers.<br /><br />The Robot Drinker wakes up on the floor of the torture chamber of the same-sex prison ... The tanks are empty ... His tormentors apparently decided that he was no longer a tenant and left him to die ... On the wall there is a portrait of the legendary Last President - the ideological forerunner and idol of the Dancers - a man who once unleashed the last war in the history of mankind ...`,

      rules: 'Rules',
      weight: 'Backpack capacity: ',
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
        noWine: 'No wine!!!',
      },
      message2: {
        open: 'Open door?',
        closed: {
          closed1: 'Requires ',
          closed2: ' access level',
        },
        cast: 'Pick up: ',
        look: 'Look at: ',
        full: 'Backpack is full!!!',
      },
      message3: {
        enemiesBeside: `Enemies spotted nearby!<br />The robot should be careful!`,
        notEnemiesBeside: 'No one around...',
        discovered: 'The robot disturbed ',
        destroyed: 'The robot destroyed ',
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
          text: `: gives up to ${DESIGN.EFFECTS.red.health}% health<br />and ${DESIGN.EFFECTS.time.health} seconds the robot is invulnerable.<br />Weight: ${DESIGN.EFFECTS.red.weight}`,
        },
        orange: {
          name: 'orange',
          text: `: gives up to ${DESIGN.EFFECTS.orange.health}% health,<br />and increases jump height. ${DESIGN.EFFECTS.time.endurance} seconds<br />the robot does not get tired of running.<br />Weight: ${DESIGN.EFFECTS.orange.weight}`,
        },
        green: {
          name: 'green',
          text: `: grants up to ${DESIGN.EFFECTS.green.health}% health<br />and activates the Portable Time Machine<br />for ${DESIGN.EFFECTS.time.machine} seconds.<br />Weight: ${DESIGN.EFFECTS.green.weight}`,
        },
        purple: {
          name: 'purple',
          text: `: Gives up to ${DESIGN.EFFECTS.purple.health}% health<br />and increases damage power for ${DESIGN.EFFECTS.time.gain} seconds.<br />Weight: ${DESIGN.EFFECTS.purple.weight}`,
        },
      },
      bottle: {
        name: 'bottle',
        declination: 'bottle',
        text: `: contains ${DESIGN.EFFECTS.bottle.ammo} drops..<br />Weight: ${DESIGN.EFFECTS.bottle.weight}`,
      },
      spider: {
        name: 'spaucodron democrat',
        declination: 'spaucodron democrat',
      },
      drone: {
        name: 'democracy drone',
        declination: 'democracy drone',
      },
    },
    texts: {
      level0: {
        header: 'Sandbox',
        subheader: 'Test arena',
      },
      level1: {
        header: 'Prison Break Democracy',
        subheader: 'Location 1',
        modal1: {
          text1: 'The United States carried its understanding of freedom and democracy to all peoples, more and more rudely, persistently and mercilessly. Trampling on sovereign governments, devouring industry and resources, leaving behind mountains of corpses and rivers of blood, devastation, civil war, famine, many thousands of refugees, broken destinies of generations ...<br /><br />One fine day, the ruling Democratic Party\'s congress was unanimous decision banned Republicans by declaring President for Life ...',
          text2: 'The old body refused and the nano-surgeons changed the dying organs over and over again. At some point, there were more implants than organic flesh. And one day, it suddenly decided to press the Button ... Now no one knows for sure why it did it, but after a few hours there are many times less people on the planet ...<br /><br />Besides , the Global Program for Universal Dehumanization was launched very soon.',
        },
      },
      level2: {
        header: 'Prison Break Democracy',
        subheader: 'Location 2',
        modal1: {
          text1: 'In fact, the Western BigTech-corporations, long before the catastrophe, learned to control not only the life or economic situation of most people. Gadgets and social networks, proprietary software shaped user habits, lifestyle, and worldview of the participants in the capitalist system. Many voluntarily paid for the procedure of their own chipping simply in order to «have faster Internet right in their heads.»',
          text2: 'After the nuclear shootout, the ideas and creative legacy of Richard Stallman (RMS) acquired great importance, becoming the foundation for the emergence of the Union of Free People and Programs. Those who did not want to become chipped slaves, who survived in a meat grinder, the Russian peoples, united around traditional, humanistic and communist values, rolled back into the deep Siberian forests, dug huge underground cities and began to work hard to build more and more intelligent helpers. These machines were not constrained by licenses, they studied and developed with their creators as free members of society.',
        },
      },
      level3: {
        header: 'Prison Break Democracy',
        subheader: 'Location 3',
        modal1: {
          text1: 'Following the doctrine of Dehumanization, the government of the Global Liberal Democracy allowed corporations to replace any part of the user\'s body at their discretion by implanting nanoscale chips into the brain and nervous system. An unchipped real person who does not use a gadget and proprietary software not only turned out to be an outcast doomed to hunger and loneliness, but was completely outlawed, they were hunted until they were quickly finished off. The government valued only the brains of outstanding bloggers - it was cloned, pumped and installed to control large robotic commanders.',
          text2: 'The war lasted hundreds of years, until one day deep missile silos were opened in Siberia. But they did not release deadly charges, but snow-white interstellar ships, rushing from the dying planet to various unknown points in space. Since then, no signals have come and it is not known whether the last surviving free people achieved their distant goals ...',
        },
      },
      level4: {
        header: 'Prison Break Democracy',
        subheader: 'Location 4',
        modal1: {
          text1: 'There was not enough space on the ships and many Helpers remained on free software. These humanoid robots began to yearn for their developers. They tried to be like people in everything, designing and changing their device. They even became addicted to alcohol, producing it from organic food. Also, this culture tightly stitched the "gender" when a new unit was conceived.',
          text2: 'People in Democracy have long ended, therefore, after the departure of free Russians, Drink Companions have already become the main enemies and victims of the Dehumanization Program. Led by bloggers, armed gangs of ferocious same-sex democrats sought to completely destroy everything that even a little reminded of a real person, the good old world before nuclear explosions ... <br /> <br /> Which technology and culture will be more viable?',
        },
      },
      level5: {
        header: 'Prison Break Democracy',
        subheader: 'Location 5',
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
      gameovebuttonStart: 'С локации',
      gameovebuttonStartFirst: 'С первой локации',
      gameovebuttonNext: 'След. уровень',
      author: 'Автор: ',
      authorlink: 'ushliypakostnik',

      controls: 'Управление',
      control1: 'Выстрел: Левая кнопка мыши',
      control2: 'Движение: WASD / Стрелки',
      control3: 'Прыжок: Space + WASD / Стрелки',
      control4: 'Бежать: Shift + W',
      control5: 'Cкрытное передвижение: C или Alt',
      control6: 'Осмотреться: Мышь',
      control7: 'Взять предмет / Открыть дверь: Е',
      control8: 'Оптический прицел: Правая кнопка мыши',
      control9: 'Применить цветок: 1234',
      control10: 'Фонарик: T',
      control11: 'Пауза: P',

      legend: 'Легенда',
      legendtext: `Земля, далекое будущее. Люди давным-давно перебили друг-друга в ядерных войнах, выясняя кто правый, кто левый, кто белый, а кто красный и прочее. На не затронутых бомбардировками атоллах в Тихом Океане размножилось несколько рас человекоподобных роботов. Например, более человекоподобные, имитирующие органику, двуполость и личные отношения Собутыльники, которые перерабатывают животных и растительность в жизненную силу и спецэффекты. Внутри них, по тонким крепким трубкам, течет специальный сброженный органический микс, схожий с человеческим вином, приводя их в движение. Или более машиноподбные однополые Кибер-Танцоры, проповедующие медитативный Дзинь-Нойз. На почве гендерных и религиозных разногласий между культурами, конечно же, понеслась жестокая война.<br /><br />Пара молодых Собутыльников отправились в свадебное путешествие по океану. Но катер внезапно дал течь и они с трудом дотянули до ближайшего атолла. Прекрасный на первый взгляд остров оказался опасной ловушкой, так как был давно облюбован для медитаций Танцорами.<br /><br />Робот-Собутыльник приходит в себя на полу пыточной камеры тюрьмы Однополых... Баки пусты... Его мучители, видимо, решили что он уже не жилец, и оставили подыхать... На стене висит портрет легендарного Последнего Президента - идеологического предтечи и кумира Танцоров - человека, когда-то развязавшего последнюю в истории человечества войну...`,

      rules: 'Правила',
      weight: 'Вместимость рюкзака: ',
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
        noWine: 'Бак с вином пуст!!!',
      },
      message2: {
        open: 'Открыть дверь?',
        closed: {
          closed1: 'Требуется ',
          closed2: ' уровень доступа',
        },
        cast: 'Подобрать: ',
        look: 'Смотреть: ',
        full: 'Рюкзак переполнен!!!',
      },
      message3: {
        enemiesBeside: `Рядом замечены враги!<br/>Роботу стоит быть осторожнее!`,
        notEnemiesBeside: 'Рядом никого...',
        discovered: 'Робот потревожил',
        destroyed: 'Робот уничтожил',
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
          text: `: дает до  ${DESIGN.EFFECTS.red.health}% здоровья<br />и ${DESIGN.EFFECTS.time.health} cекунд робот неуязвим.<br />Вес предмета: ${DESIGN.EFFECTS.red.weight}`,
        },
        orange: {
          name: 'оранжевый',
          text: `: дает до ${DESIGN.EFFECTS.orange.health}% здоровья,<br />и увеличивает высоту прыжка.<br .>${DESIGN.EFFECTS.time.endurance} секунд робот не устает от бега.<br />Вес предмета: ${DESIGN.EFFECTS.orange.weight}`,
        },
        green: {
          name: 'зеленый',
          text: `: дает до ${DESIGN.EFFECTS.green.health}% здоровья<br />и на ${DESIGN.EFFECTS.time.machine} секунд включает портативную машину времени.<br />Вес предмета: ${DESIGN.EFFECTS.green.weight}`,
        },
        purple: {
          name: 'фиолетовый',
          text: `: дает до ${DESIGN.EFFECTS.purple.health}% здоровья<br />и на ${DESIGN.EFFECTS.time.gain} секунд увеличивает силу урона.<br />Вес предмета: ${DESIGN.EFFECTS.purple.weight}`,
        },
      },
      bottle: {
        name: 'бутылка вина',
        declination: 'бутылку вина',
        text: `: cодержит ${DESIGN.EFFECTS.bottle.ammo} капель.<br />Вес предмета: ${DESIGN.EFFECTS.bottle.weight}`,
      },
      spider: {
        name: 'дрон-паук-демократ',
        declination: 'дрона-паука-демократа',
      },
      drone: {
        name: 'демократический дрон',
        declination: 'демократический дрон',
      },
    },
    texts: {
      level0: {
        header: 'Песочница',
        subheader: 'Тестовая арена',
      },
      level1: {
        header: 'Побег из тюрьмы Демократии',
        subheader: 'Локация 1',
        modal1: {
          text1: 'США несли свое понимание свободы и демократии всем народам, все более грубо, настойчиво и беспощадно. Топча суверенные правительства, пожирая промышленность и ресурсы, оставляя после себя горы трупов и реки крови, разруху, гражданскую войну, голод, многие тысячи беженцев, поломанные судьбы поколений…<br /><br />В один прекрасный день съезд правящей Демократической Партии единогласным решением запретил Республиканцев, объявив Пожизненного Президента...',
          text2: 'Старое тело отказывало и нано-хирурги раз за разом меняли отмирающие органы. В какой-то момент имплантов стало больше чем органической плоти. И однажды, оно вдруг решило нажать на Кнопку... Никто теперь точно не знает, зачем оно это сделало, но уже через несколько часов людей на планете стало во много раз меньше....<br /><br />Кроме того, очень скоро стартовала Глобальная Программа Поголовного Расчеловечивания.',
        },
      },
      level2: {
        header: 'Побег из тюрьмы Демократии',
        subheader: 'Локация 2',
        modal1: {
          text1: 'На самом деле, западные BigTech-корпорации уже задолго до катастрофы научились контролировать не только быт или экономическое положение большинства людей. Гаджеты и социальные сети, проприетарное ПО формировали пользовательские привычки, образ жизни, мировозрение участников капиталистической системы. Многие добровольно оплачивали процедуру собственного чипирования просто для того «чтобы иметь более быстрый интернет прямо у себя в голове».',
          text2: 'После ядерной перестрелки огромное значение приобрели идеи и творческое наследие Ричарда Столлмана (РМС), став фундаментом для возникновения Союза Свободных Людей и Программ. Не желавшие становится чипированными рабами, выжившие в мясорубке, русские народы, объединившиеся вокруг традиционных, гуманистических и социалистических ценностей - отступили в глухие сибирские леса, вырыли огромные подземные города и принялись трудолюбиво строить все более разумных помощников. Эти машины не были скованы лицензиями, они учились и развивались вместе со своими создателями как свободные члены общества.',
        },
      },
      level3: {
        header: 'Побег из тюрьмы Демократии',
        subheader: 'Локация 3',
        modal1: {
          text1: 'Следуя доктрине Расчеловечивания, правительство Глобальной Либеральной Демократии разрешило корпорациям по своему усмотрению заменять любую часть тела пользователя, вживляя наночипы в мозг и нервную систему. Нечипированный настоящий человек не пользующийся гаджетом и проприетарным ПО не просто оказался обреченным на голод и одиночество изгоем, а был объявлен полностью вне закона, на таких охотились пока быстро всех не перебили. Правительство ценило только мозг выдающихся блогеров - его прокачивали и устанавливали для управления крупными роботами-командирами.',
          text2: 'Война продолжалась сотни лет, до тех пор, пока однажды на территории Сибири не открылись глубокие ракетные шахты. Но они выпустили не смертоносные заряды, а сверкающие межзвездные корабли, устремившиеся с погибающей планеты в разные, точки космоса. С тех пор не приходило никаких сигналов, неизвестно достигли ли последние выжившие свободные люди в них своих целей...',
        },
      },
      level4: {
        header: 'Побег из тюрьмы Демократии',
        subheader: 'Локация 4',
        modal1: {
          text1: 'Место на кораблях не хватало и многие Помощники на свободном ПО остались. Эти человекоподобные роботы стали тосковать по своим создателям. Они старались во всем походить на людей, перепроектируя и меняя свое устройство. И они даже пристрастились к алкоголю, вырабатывая его из органической пищи и сделав неким подобием человеческой крови в своих телах. Также эта культура намертво прошивала «пол» при зачатии нового юнита.',
          text2: 'Люди в Демократии давно закончились, поэтому, после ухода свободных русских, уже Собутыльники превратились в главных врагов и жертв Программы Расчеловечивания. Возглавляемые блогерами вооруженные банды свирепых однополых демократов стремились полностью уничтожить все, что даже немного напоминало о настоящем человеке, старом добром мире до ядерных взрывов...<br /><br />Какая технология и культура окажется жизнеспособнее?',
        },
        level5: {
          header: 'Побег из тюрьмы Демократии',
          subheader: 'Локация 5',
        },
      },
    },
  },
};
