Drinking Robot: Browser classic custom FPS Game on Three, Vue and Blender.
===========================================================================

![First screen](https://github.com/ushliypakostnik/robot-game/raw/master/public/start.jpg)

Играть: http://robot-game.ru/

[Статья на Хабр о этом проекте](https://habr.com/ru/post/556238/)


Земля, далекое будущее. Люди давным-давно перебили друг-друга в ядерных войнах, выясняя кто правый, кто левый, кто белый, а кто красный и прочее. На не затронутых бомбардировками атоллах в Тихом Океане размножилось несколько рас человекоподобных роботов. Например, более человекоподобные, имитирующие органику, двуполость и личные отношения Собутыльники, которые перерабатывают животных и растительность в жизненную силу и спецэффекты. Внутри них, по тонким крепким трубкам, течет специальный сброженный органический микс, схожий с человеческим вином, приводя их в движение. Или более машиноподбные однополые Кибер-Танцоры, проповедующие медитативный Дзинь-Нойз. На почве гендерных и религиозных разногласий между культурами, конечно же, понеслась жестокая война.

Пара молодых Собутыльников отправились в свадебное путешествие по океану. Но катер внезапно дал течь и они с трудом дотянули до ближайшего атолла. Прекрасный на первый взгляд остров оказался опасной ловушкой, так как был давно облюбован для медитаций Танцорами.

Робот-Собутыльник приходит в себя на полу пыточной камеры тюрьмы Однополых... Баки пусты... Его мучители, видимо, решили что он уже не жилец, и оставили подыхать... На стене висит портрет легендарного Последнего Президента - идеологического предтечи и кумира Танцоров - человека, когда-то развязавшего последнюю в истории человечества войну...

------

Earth, distant future. People a long time ago killed each other in nuclear wars, finding out who is right, who is left, who white, and who is red and so on. Several races bred on unbombed atolls in the Pacific Ocean humanoid robots. For example, more human-like, imitating organic, bisexual and personal relationships Drinking companions, which transform animals and vegetation into life force and special effects. Inside them, through thin strong tubes, a special a fermented organic mix similar to human wine, setting them in motion. Or more machine-like same-sex Cyber ​​Dancers preaching meditative Zen-Noise. Gender and religious differences between cultures, of course, raged a fierce war.

A couple of young drinking buddies set off on a honeymoon trip across the ocean. But the boat suddenly started leaking and they barely made it to the nearest atoll. The island, beautiful at first glance, turned out to be a dangerous trap, as it had long been chosen for meditation by the Dancers.

The Robot Drinker wakes up on the floor of the torture chamber of the same-sex prison ... The tanks are empty ... His tormentors apparently decided that he was no longer a tenant and left him to die ... On the wall there is a portrait of the legendary Last President - the ideological forerunner and idol of the Dancers - a man who once unleashed the last war in the history of mankind ...


Deploy
------

Установка зависимостей npm packages

    $ npm install

Запуск сервера для разработки
-----------------------------

    $ npm run serve

    http://localhost:3000/

Cборка
------

Сборка проекта в продакшен, в папку /build

    $ npm run build

Тесты
-----

Запуск статического анализатора ES

    $ npm run lint

Запуск статического анализатора стиоей

    $ npm run stylelint


Структура проекта
-----------------

```
.
└─ /public // статические ресурсы
│  ├─ /audio // аудио
│  │  └─ ...
│  ├─ /images // изображения
│  │  ├─ /favicons // дополнительные фавиконки для браузеров
│  │  │  └─ ...
│  │  ├─ /modals // картинки для информационных панелей
│  │  │  ├─ /level1 // для уровня 1
│  │  │  │  └─ ...
│  │  │  └─ ...
│  │  ├─ /models
│  │  │  ├─ /Levels
│  │  │  │  ├─ /level0 // модель-схема Песочницы (скрытый уровень 0 - тестовая арена)
│  │  │  │  │  └─ Scene.glb
│  │  │  │  └─ ...
│  │  │  └─ /Objects
│  │  │     ├─ Element.glb
│  │  │     └─ ...
│  │  └─ /textures
│  │     ├─ texture1.jpg
│  │     └─ ...
│  ├─ favicon.ico // основная фавиконка 16 на 16
│  ├─ index.html // статичный индекс
│  ├─ manifest.json // файл манифеста
│  └─ start.jpg // картинка для репозитория )
├─ /src
│  ├─ /assets // ассеты сорцов
│  │  └─ optical.png // у меня один такой )))
│  ├─ /components // компоненты, миксины и модули
│  │  ├─ /Layout // компоненты и миксины UI-обертки над игрой
│  │  │  ├─ Component1.vue // копонент 1
│  │  │  ├─ mixin1.js // миксин 1
│  │  │  └─ ...
│  │  └─ /Three // сама игра
│  │     ├─ /Modules // готовые полезные модули из библиотеки
│  │     │  └─ ...
│  │     └─ /Scene
│  │        ├─ /Enemies // модули врагов
│  │        │  ├─ Enemy1.js
│  │        │  └─ ...
│  │        ├─ /Weapon // модули оружия
│  │        │  ├─ Explosions.js // взрывы
│  │        │  ├─ HeroWeapon.js // оружие персонажа
│  │        │  └─ Shots.js // выстрелы врагов
│  │        ├─ /World // модули различных элементов мира
│  │        │  ├─ Element1.js
│  │        │  └─ ...
│  │        ├─ Atmosphere.js // модуль с общими для всех уровней объектами (общий свет, небо, звук ветра) и проверками-взаимодействия между другими модулями
│  │        ├─ AudioBus.js // аудио-шина
│  │        ├─ Enemies.js // модуль всех врагов
│  │        ├─ EventsBus.js // шина событий
│  │        ├─ Hero.js // модуль персонажа
│  │        ├─ Scene.vue // основной компонент игры
│  │        └─ World.js // мир
│  ├─ /store // стор Vuex
│  │  └─ ...
│  ├─ /styles // стилевая база препроцессора
│  │  └─ ...
│  ├─ /utils // набор утилитарных js-модулей для различных функциональностей
│  │  ├─ api.js // интерфейсы для связи с бэкендом
│  │  ├─ constants.js // вся конфигурация игры и тексты-переводы
│  │  ├─ i18n.js // конфигурация переводчика
│  │  ├─ screen-helper.js // модуль "экранный помощник"
│  │  ├─ storage.js // модуль для взаимодействия с браузерным хранилищем
│  │  └─ utilities.js // набор полезных функций-атомов
│  ├─ App.vue // "верхний" компонент
│  └─ main.js // эндпоинт сорцов Vue
└─ ... // все остальное на верхнем уровне проекта, как обычно: конфиги, gitignore, README.md и прочее
