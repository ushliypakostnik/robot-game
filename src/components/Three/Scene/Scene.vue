<template>
  <div
    id="scene"
    class="scene"
  />
</template>

<script>
import * as Three from 'three';

import { mapActions, mapGetters } from 'vuex';

// Controls
import { PointerLockControls } from '@/components/Three/Modules/Controls/PointerLockControls';

// World
import { Octree } from '../Modules/Math/Octree';

// Stats
// import Stats from '@/components/Three/Modules/Utils/Stats';

// Config
import {
  isBackend,
  LOCALSTORAGE,
  DESIGN
} from '@/utils/constants';

// Utils
import storage from '@/utils/storage';

// Mixins
import layout from '@/components/Layout/layout';
import hero from '@/components/Layout/hero';

// Modules
import AudioBus from '@/components/Three/Scene/AudioBus';
import EventsBus from '@/components/Three/Scene/EventsBus';
import World from '@/components/Three/Scene/World';

export default {
  name: 'Scene',

  mixins: [
    layout,
    hero,
  ],

  data() {
    return {
      renderer: null,

      scene: null,

      camera: null,

      controls: null,

      clock: null,
      delta: null,

      listener: null,

      // hero

      directionStore: null,
      keyStates: {},
      isRun: false,
      isHidden: false,
      isToruch: true,

      // world

      octree: null,
      octreeDoors: null,
      octreeEnemies: null,
      octreeHeroEnemies: null,

      toruch: null,

      // modules

      audio: null,
      events: null,

      hero: null,
      world: null,
      atmosphere: null,
      weapon: null,
      weaponOptical: null,

      // utilities

      distance: null,
      position: null,
      direction: null,
      directionOnHero: null,
      angle: null,
      rotate: null,
      cooeficient: null,
      boolean: null,
      number: null,
      array: [],
      result: null,
      resultDoors: null,
      resultEnemies: null,
      group: null,

      y: null,
      yN: null,

      ray: null,
      raycaster: null,
      intersections: null,
      onForward: null,
      object: null,

      decision: null,

      // store objects
      objects: [],
      doors: [],
      screens: [],
      things: [],
      enemies: [],
    };
  },

  created() {
    this.$eventHub.$on('lock', this.lock);
    this.$eventHub.$on('unlock', this.unlock);

    if (!this.isUser) this.setUser();
  },

  mounted() {
    this.octree = new Octree();
    this.octreeDoors = new Octree();
    this.octreeEnemies = new Octree();
    this.octreeHeroEnemies = new Octree();

    this.position = new Three.Vector3();
    this.direction = new Three.Vector3();
    this.directionOnHero = new Three.Vector3();
    this.directionStore = new Three.Vector3();
    this.y = new Three.Vector3(0, 1, 0);
    this.yN = new Three.Vector3(0, -1, 0);
    this.group = new Three.Group();

    this.ray = new Three.Ray(
      new Three.Vector3(),
      new Three.Vector3()
    );
    this.raycaster = new Three.Raycaster(
      new Three.Vector3(),
      new Three.Vector3(0, 0, -1), 0, 3,
    );

    this.clock = new Three.Clock();

    this.listener = new Three.AudioListener();

    if (!isBackend) {
      this.init();
      this.animate();
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    document.removeEventListener('keydown', this.onKeyDown, false);
    document.removeEventListener('keyup', this.onKeyUp, false);

    // eslint-disable-next-line no-underscore-dangle
    if (this.$eventHub._events.lock) this.$eventHub.$off('lock');
    // eslint-disable-next-line no-underscore-dangle
    if (this.$eventHub._events.unlock) this.$eventHub.$off('unlock');
  },

  computed: {
    ...mapGetters({
      isGameLoaded: 'preloader/isGameLoaded',

      isFetching: 'layout/isFetching',

      difficulty: 'layout/difficulty',

      level: 'layout/level',
      levelFrom: 'layout/levelFrom',

      isPause: 'layout/isPause',
      isModal: 'layout/isModal',

      messages: 'layout/messages',
      message: 'layout/message',

      isWin: 'layout/isWin',
      isGameOver: 'layout/isGameOver',

      directionX: 'hero/directionX',
      directionY: 'hero/directionY',
      directionZ: 'hero/directionZ',
    }),

    l() {
      return `level${this.level}`;
    },

    damping() {
      return Math.exp(-3 * this.delta) - 1;
    },
  },

  methods: {
    ...mapActions({
      togglePause: 'layout/togglePause',

      addMessage: 'layout/addMessage',
      showMessage: 'layout/showMessage',
      hideMessageByView: 'layout/hideMessageByView',

      setModal: 'layout/setModal',

      setWin: 'layout/setWin',
      setGameOver: 'layout/setGameOver',

      setScale: 'hero/setScale',
    }),

    init() {
      // Container
      const container = document.getElementById('scene');

      // Renderer

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);

      container.appendChild(this.renderer.domElement);

      // Scene

      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(DESIGN.COLORS.blue);

      // Туман
      this.scene.fog = new Three.Fog(
        DESIGN.COLORS.white,
        DESIGN.LEVELS.size[this.l] / 50,
        DESIGN.LEVELS.size[this.l] * 1.5,
      );

      // Cameras

      this.camera = new Three.PerspectiveCamera(
        DESIGN.CAMERA.fov,
        container.clientWidth / container.clientHeight,
        0.1,
        DESIGN.LEVELS.size[this.l] * 3,
      );

      // Audio listener
      this.camera.add(this.listener);

      // Controls

      // In First Person

      this.controls = new PointerLockControls(this.camera, this.renderer.domElement);

      this.controls.addEventListener('unlock', () => {
        if (!this.isGameOver) {
          this.directionStore = this.camera.getWorldDirection(this.direction);
          this.togglePause(true);
        }
      });

      this.controls.addEventListener('lock', () => {
        if (this.isModal) this.setModal({ isModal: false, modalId: null });
        this.togglePause(false);
      });

      this.scene.add(this.controls.getObject());

      this.scene.add(this.camera);

      // Modules
      this.audio = new AudioBus();
      this.audio.init(this);

      this.events = new EventsBus();

      this.world = new World();
      this.world.init(this);


      // Listeners
      window.addEventListener('resize', this.onWindowResize, false);
      document.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('keyup', this.onKeyUp, false);
      document.body.onmousedown = (event) => {
        if (!this.isPause
            && !this.isGameOver
            && event.button === 0) this.hero.shot(this);

        if (!this.isPause
            && !this.isGameOver
            && event.button === 2
            && !this.isOptical) {
          this.setScale({
            field: 'isOptical',
            value: true,
          });
        }
      };

      document.body.onmouseup = (event) => {
        if (!this.isPause
            && !this.isGameOver
            && event.button === 2
            && this.isOptical) {
          this.setScale({
            field: 'isOptical',
            value: false,
          });
        }
      };

      // Stats
      // this.stats = new Stats();
      // container.appendChild(this.stats.dom);

      // First render
      this.render();
    },

    lock() {
      this.controls.lock();
    },

    unlock() {
      this.controls.unlock();
    },

    // eslint-disable-next-line no-unused-vars
    onKeyDown(event) {
      this.keyStates[event.code] = true;

      switch (event.keyCode) {
        case 116: // F5
          if (!isBackend) {
            if (this.isGameOver) storage.updateHero(this.level, false);
            else storage.saveHero(this, true);
          } else if (localStorage.getItem(LOCALSTORAGE.ROBOTID)) {
            event.preventDefault();
            if (this.isGameOver) {
              this.updateUser({
                scope: this,
                isFirst: false,
                level: this.level,
                levelFrom: this.levelFrom,
              });
            } else {
              this.saveUser({
                scope: this,
                isF5: true,
                level: this.level,
                levelFrom: this.levelFrom,
              });
            }
          }
          break;

        case 16: // Shift
          if (!this.isPause
              && !this.isRun
              && !this.isHidden
              && !this.isHeroTired) this.isRun = true;
          break;

        case 49: // 1
          if (!this.isPause
              && !this.isNotDamaged
              && this.red > 0) {
            this.setScale({
              field: DESIGN.FLOWERS.red,
              value: -1,
            });
            this.setScale({
              field: DESIGN.HERO.scales.health.name,
              value: DESIGN.EFFECTS.red.health,
            });
            this.setScale({
              field: 'isNotDamaged',
              value: true,
            });
            this.setScale({
              field: 'weight',
              value: -1 * DESIGN.EFFECTS.red.weight
            });
            this.events.messagesByIdDispatchHelper(this, 1, 'startNoDamaged');
            this.events.heroOnUpgradeDispatchHelper(this);
          }
          break;

        case 50: // 2
          if (!this.isPause
            && !this.isNotTired
            && this.orange > 0) {
            this.setScale({
              field: DESIGN.FLOWERS.orange,
              value: -1,
            });
            this.setScale({
              field: DESIGN.HERO.scales.health.name,
              value: DESIGN.EFFECTS.orange.health,
            });
            if (this.isHeroTired) {
              this.setScale({
                field: 'isHeroTired',
                value: false,
              });
            }
            this.setScale({
              field: 'isNotTired',
              value: true,
            });
            this.setScale({
              field: 'weight',
              value: -1 * DESIGN.EFFECTS.orange.weight
            });
            this.events.messagesByIdDispatchHelper(this, 1, 'startNoTired');
            this.events.heroOnUpgradeDispatchHelper(this);
          }
          break;

        case 51: // 3
          if (!this.isPause
              && !this.isTimeMachine
              && this.green > 0) {
            this.setScale({
              field: DESIGN.FLOWERS.green,
              value: -1,
            });
            this.setScale({
              field: DESIGN.HERO.scales.health.name,
              value: DESIGN.EFFECTS.green.health,
            });
            this.setScale({
              field: 'isTimeMachine',
              value: true,
            });
            this.setScale({
              field: 'weight',
              value: -1 * DESIGN.EFFECTS.green.weight
            });
            this.events.messagesByIdDispatchHelper(this, 1, 'startTimeMachine');
            this.events.heroOnUpgradeDispatchHelper(this);
          }
          break;

        case 52: // 4
          if (!this.isPause
              && !this.isGain
              && this.purple > 0) {
            if (this.ammo > 0) {
              this.setScale({
                field: DESIGN.FLOWERS.purple,
                value: -1,
              });
              this.setScale({
                field: DESIGN.HERO.scales.health.name,
                value: DESIGN.EFFECTS.purple.health,
              });
              this.setScale({
                field: 'isGain',
                value: true,
              });
              this.setScale({
                field: 'weight',
                value: -1 * DESIGN.EFFECTS.purple.weight
              });
              this.events.messagesByIdDispatchHelper(this, 1, 'startGain');
              this.events.heroOnUpgradeDispatchHelper(this);
            } else this.events.messagesByIdDispatchHelper(this, 1, 'noWine');
          }
          break;
      }
    },

    onKeyUp(event) {
      this.keyStates[event.code] = false;

      switch (event.keyCode) {
        case 16: // Shift
          if (!this.isPause && this.isRun) this.isRun = false;
          break;

        case 67: // C
        case 18: // Alt
          if (!this.isPause) this.isHidden = !this.isHidden;
          break;

        case 80: // P
          if (this.isPause) {
            this.controls.lock();
          } else this.controls.unlock();
          break;

        case 84: // T
          if (!this.isPause) {
            if (this.isToruch) {
              this.toruch.visible = false;
              this.isToruch = false;
              this.events.messagesByIdDispatchHelper(this, 1, 'toruchOff');
            } else {
              this.toruch.visible = true;
              this.isToruch = true;
              this.events.messagesByIdDispatchHelper(this, 1, 'toruchOn');
            }
          }
          break;
      }
    },

    animate() {
      this.delta = this.clock.getDelta();

      if (!this.isPause
          && !this.isGameOver
          && !this.isFetching) {
        // Modules
        this.events.animate(this);

        this.hero.animate(this);
        this.world.animate(this);

        this.render();
      }

      // this.stats.update();

      requestAnimationFrame(this.animate);
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    render() {
      this.renderer.render(this.scene, this.camera);
      // console.log('Renderer info: ', this.renderer.info.memory.geometries, this.renderer.info.memory.textures, this.renderer.info.render);
    },
  },

  watch: {
    isUser(value) {
      if (value) {
        this.init();
        this.animate();
      }
    },

    isPause(value) {
      this.audio.toggle();
      if (!value && this.isOptical) {
        this.setScale({
          field: 'isOptical',
          value: false,
        });
      }
    },

    isOptical(value) {
      this.hero.checkWeapon(this);
      this.hero.toggleFire(value);
      if (value) this.camera.fov = DESIGN.CAMERA.fov / 4;
      else this.camera.fov = DESIGN.CAMERA.fov;
      this.camera.updateProjectionMatrix();
    },

    difficulty(value) {
      this.world.atmosphere.setCheck(value);
    },

    isHeroTired(value) {
      if (value && this.isRun) this.isRun = false;
      if (value) this.events.messagesByIdDispatchHelper(this, 1, 'tired');
      else this.events.messagesByIdDispatchHelper(this, 1, 'recovered');
    },

    isRun(value) {
      if (!this.isHidden) this.hero.setRun(this, value);
    },

    isHidden(value) {
      this.hero.setHidden(this, value);
      if (value) {
        if (this.isRun) this.isRun = false;
        this.events.messagesByIdDispatchHelper(this, 1, 'hiddenMoveEnabled');
      } else this.events.messagesByIdDispatchHelper(this, 1, 'hiddenMoveDisabled');
    },

    isHeroOnHit(value) {
      this.hero.setOnHit(this, value);
    },

    isHeroOnDamage(value) {
      this.hero.setHeroOnDamage(this, value);
    },

    isTimeMachine() {
      this.audio.toggleTime();
    },

    isGameOver(value) {
      if (value) {
        this.controls.unlock();
        this.audio.toggle();
      }
    },
  },
};
</script>

<style scoped>
.scene {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
}
</style>
