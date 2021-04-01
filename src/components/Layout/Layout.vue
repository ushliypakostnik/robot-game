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
      >
        <Instructions />

        <div class="layout__button-wrapper">
          <button
            class="layout__button button"
            type="button"
            @click.prevent.stop="play"
          >{{ $t('layout.startbutton') }}</button>
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

import Gate from '@/components/Layout/Gate.vue';
import Preloader from '@/components/Layout/Preloader.vue';
import Scene from '@/components/Three/Scene/Scene.vue';
import UI from '@/components/Layout/UI.vue';
import Instructions from '@/components/Layout/Instructions.vue';

export default {
  name: 'Layout',

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
  }

  &__button {
    margin: 0 auto;

    &-wrapper {
      display: flex;
      width: 100%;
      position: fixed;
      bottom: $gutter;
      z-index: $layouts__2;
    }
  }
}
</style>
