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
import Stats from '@/components/Three/Modules/Utils/Stats';

import { DESIGN } from '@/utils/constants';
import {
  messagesByIdDispatchHelper,
} from '@/utils/utilities';

// Modules
import AudioBus from '@/components/Three/Scene/AudioBus';
import EventsBus from '@/components/Three/Scene/EventsBus';
import Hero from '@/components/Three/Scene/Hero';
import World from '@/components/Three/Scene/World';
import Atmosphere from '@/components/Three/Scene/Atmosphere';

export default {
  name: 'Scene',

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
      startDirection: null,
      directionStore: null,
      keyStates: {},
      isRun: false,
      isHidden: false,
      isToruch: true,

      // world
      octree: null,
      octreeMutable: null,

      toruch: null,

      // modules
      audio: null,
      events: null,

      hero: null,
      world: null,
      atmosphere: null,

      // utilities

      position: null,
      direction: null,
      result: null,
      resultMutable: null,
      damping: null,

      raycaster: null,
      intersections: null,
      onForward: null,
      object: null,

      // store objects
      objects: [],
      doors: [],
      things: [],
    };
  },

  mounted() {
    this.octree = new Octree();
    this.octreeMutable = new Octree();

    this.position = new Three.Vector3();
    this.direction = new Three.Vector3();
    this.startDirection = new Three.Vector3(-0.7071067758832469, 0, 0.7071067864898483);
    this.directionStore = this.startDirection;

    this.clock = new Three.Clock();

    this.listener = new Three.AudioListener();

    this.init();
    this.animate();
  },

  created() {
    this.$eventHub.$on('lock', this.lock);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
    document.removeEventListener('keydown', this.onKeyDown, false);
    document.removeEventListener('keyup', this.onKeyUp, false);

    // eslint-disable-next-line no-underscore-dangle
    if (this.$eventHub._events.lock) this.$eventHub.$off('lock');
  },

  computed: {
    ...mapGetters({
      isGameLoaded: 'preloader/isGameLoaded',

      level: 'layout/level',
      isPause: 'layout/isPause',

      messages: 'layout/messages',
      message: 'layout/message',

      isWin: 'layout/isWin',
      isGameOver: 'layout/isGameOver',

      health: 'hero/health',
      endurance: 'hero/endurance',
      ammo: 'hero/ammo',

      anemone: 'hero/anemone',
      crocus: 'hero/crocus',
      daffodil: 'hero/daffodil',
      tulip: 'hero/tulip',

      passes: 'hero/passes',

      isHeroTired: 'hero/isHeroTired',

      isHeroOnDamage: 'hero/isHeroOnDamage',
      isHeroOnHit: 'hero/isHeroOnHit',

      isNotDamaged: 'hero/isNotDamaged',
      isNotTired: 'hero/isNotTired',
    }),

    l() {
      return `level${this.level}`;
    },
  },

  methods: {
    ...mapActions({
      togglePause: 'layout/togglePause',

      addMessage: 'layout/addMessage',
      showMessage: 'layout/showMessage',
      hideMessageByView: 'layout/hideMessageByView',

      setWin: 'layout/setWin',
      setGameOver: 'layout/setGameOver',

      setScale: 'hero/setScale',
      addPass: 'hero/addPass',
      setHeroTired: 'hero/setHeroTired',
      setHeroOnUpgrade: 'hero/setHeroOnUpgrade',

      setNotTired: 'hero/setNotTired',
      setNotDamaged: 'hero/setNotDamaged',

      setHeroOnDamage: 'hero/setHeroOnDamage',
      setHeroOnHit: 'hero/setHeroOnHit',
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
      this.scene.fog = new Three.Fog(DESIGN.COLORS.white, DESIGN.WORLD_SIZE[this.l] / 10, DESIGN.WORLD_SIZE[this.l] * 2);

      // Cameras

      this.camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, DESIGN.WORLD_SIZE[this.l] * 4.25);

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
        this.togglePause(false);
      });

      this.camera.lookAt(this.startDirection.multiplyScalar(1000));

      this.scene.add(this.controls.getObject());

      this.scene.add(this.camera);

      // Modules
      this.audio = new AudioBus();
      this.audio.init(this);

      this.events = new EventsBus();

      this.hero = new Hero();
      this.hero.init(this);

      this.world = new World();
      this.world.init(this);

      this.atmosphere = new Atmosphere();
      this.atmosphere.init(this);

      // Listeners
      window.addEventListener('resize', this.onWindowResize, false);
      document.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('keyup', this.onKeyUp, false);

      // Stats
      this.stats = new Stats();
      container.appendChild(this.stats.dom);

      // First render
      this.render();
    },

    lock() {
      this.controls.lock();
    },

    // eslint-disable-next-line no-unused-vars
    onKeyDown(event) {
      this.keyStates[event.code] = true;

      switch (event.keyCode) {
        case 16: // Shift
          if (!this.isPause && !this.isRun && !this.isHeroTired) this.isRun = true;
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
          if (this.isToruch) {
            this.toruch.visible = false;
            this.isToruch = false;
            this.events.messagesByIdDispatchHelper(this, 1, 'toruchOff');
          } else {
            this.toruch.visible = true;
            this.isToruch = true;
            this.events.messagesByIdDispatchHelper(this, 1, 'toruchOn');
          }
          break;
      }
    },

    animate() {
      this.delta = this.clock.getDelta();

      if (!this.isPause && !this.isGameOver) {
        // Modules
        this.events.animate(this);

        this.hero.animate(this);
        this.world.animate(this);
        this.atmosphere.animate(this);
      }

      if (!this.isPause) this.render();

      this.stats.update();

      requestAnimationFrame(this.animate);
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },
  },

  watch: {
    isPause() {
      this.audio.toggle();
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

    isGameOver(value) {
      if (value) this.controls.unlock();
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
