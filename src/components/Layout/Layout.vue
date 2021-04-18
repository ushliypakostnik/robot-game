<template>
  <div
    v-if="isDesktop && isBro"
    class="layout"
  >
    <Preloader>
      <Scene />

      <UI />

      <div
        v-if="isPause && isGameLoaded"
        class="layout__blocker"
        :class="isModal && 'layout__blocker--modal'"
      >
        <Instructions v-if="!isModal" />

        <div class="layout__button-wrapper">
          <button
            class="layout__button button"
            type="button"
            @click.prevent.stop="play"
          >{{ $t('layout.startbutton') }}</button>

          <!-- Для перехода из песочницы -->
          <button
            class="layout__button button"
            type="button"
            v-if="level === 0"
            @click.prevent.stop="reloadToStartFromSandbox"
          >{{ $t('layout.gameovebuttonNext') }}</button>
        </div>
      </div>
    </Preloader>
  </div>

  <Gate
    v-else-if="!isDesktop"
    face="gadgets"
  />
  <Gate
    v-else
    face="chrome"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ScreenHelper from '@/utils/screen-helper';

import layout from './layout';

import Gate from '@/components/Layout/Gate.vue';
import Preloader from '@/components/Layout/Preloader.vue';
import Scene from '@/components/Three/Scene/Scene.vue';
import UI from '@/components/Layout/UI.vue';
import Instructions from '@/components/Layout/Instructions.vue';

export default {
  name: 'Layout',

  mixins: [layout],

  components: {
    Gate,
    Preloader,
    Scene,
    UI,
    Instructions,
  },

  data() {
    return {
      isDesktop: null,
      isBro: ScreenHelper.isBro(),
    };
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, false);
  },

  mounted() {
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize();
  },

  computed: {
    ...mapGetters({
      isPause: 'layout/isPause',
      isModal: 'layout/isModal',

      level: 'layout/level',

      isGameLoaded: 'preloader/isGameLoaded',
    }),
  },

  methods: {
    onWindowResize() {
      this.isDesktop = !!ScreenHelper.isDesktop();
    },

    play() {
      this.$eventHub.$emit('lock');
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_main.scss";

.layout {
  position: fixed;
  @include size(100vw, 100vh);

  &__blocker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $colors__gate;
    z-index: $layouts__1;
    @include size(100%, 100%);

    &--modal {
      background-color: transparent;
      height: 0;
    }
  }

  &__button {
    & + .layout__button {
      margin-left: $gutter * 2;
    }

    &-wrapper {
      display: flex;
      justify-content: center;

      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      width: 100%;
      position: fixed;
      z-index: $layouts__2;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
      padding: $gutter * 3 0 $gutter * 1.5;
    }
  }
}
</style>
