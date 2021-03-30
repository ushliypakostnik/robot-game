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

import { DESIGN, OBJECTS } from '@/utils/constants';
import {
// messagesByIdDispatchHelper,
// messagesByViewDispatchHelper,
} from '@/utils/utilities';

// Modules
import Hero from '@/components/Three/Scene/Hero';
import World from '@/components/Three/Scene/World';

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

      // hero
      playerStartDirection: null,
      keyStates: {},
      isRun: false,
      toruch: false,
      isToruch: true, // TODO: перенести в стор персонажа когда будет


      // world
      octree: null,
      octreeMutable: null,

      // modules
      hero: null,
      world: null,

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
    };
  },

  mounted() {
    this.octree = new Octree();
    this.octreeMutable = new Octree();

    this.position = new Three.Vector3();
    this.direction = new Three.Vector3();
    this.playerStartDirection = new Three.Vector3(-0.7071067758832469, 0, 0.7071067864898483);

    this.clock = new Three.Clock();

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

      this.camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, DESIGN.WORLD_SIZE[this.l] * 4);

      // Controls

      // In First Person

      this.controls = new PointerLockControls(this.camera, this.renderer.domElement);

      this.controls.addEventListener('unlock', () => {
        this.togglePause(true);
      });

      this.controls.addEventListener('lock', () => {
        this.togglePause(false);
      });

      this.camera.lookAt(this.playerStartDirection.multiplyScalar(1000));

      this.scene.add(this.controls.getObject());

      this.scene.add(this.camera);

      // Modules
      this.hero = new Hero();
      this.hero.init(this);

      this.world = new World();
      this.world.init(this);

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
    },

    onKeyUp(event) {
      this.keyStates[event.code] = false;

      // eslint-disable-next-line default-case
      switch (event.keyCode) {
        case 70: // F
          if (this.isToruch) {
            this.toruch.visible = false;
            this.isToruch = false;
          } else {
            this.toruch.visible = true;
            this.isToruch = true;
          }
          console.log('Отпустили F!!!');
          break;

        case 80: // P
          if (this.isPause) {
            this.controls.lock();
          } else this.controls.unlock();
          break;

        case 27: // Ecs
          this.togglePause(!this.isPause);
          break;
      }
    },

    animate() {
      this.delta = this.clock.getDelta();

      if (!this.isPause) {
        // Modules
        this.hero.animate(this);
        this.world.animate(this);
      } else {
        // this.module.stop();
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
