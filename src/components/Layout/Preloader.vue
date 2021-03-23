<template>
  <div class="preloader">
    <slot />
    <div
      v-if="!isGameLoaded"
      class="preloader__gate"
    >
      <Loader />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Loader from '@/components/Layout/Loader.vue';

export default {
  name: 'Preloader',

  components: {
    Loader,
  },

  computed: {
    ...mapGetters({
      isGameLoaded: 'preloader/isGameLoaded',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_main.scss";

.preloader {
  &__gate {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: $colors__white;
    background: $colors__black;
    display: flex;
    justify-content: center;
    align-items: center;
    @include size(100%, 100%);
  }
}
</style>
