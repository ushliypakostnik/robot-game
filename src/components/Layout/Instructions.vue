<template>
  <swiper
    class="swiper"
    :options="swiperOptions"
  >
    <swiper-slide>
      <div class="instructions">
        <h1>{{ $t('layout.title') }} {{ version }}</h1>
        <h3>{{ $t('layout.level') }} {{ level }}: {{ $t(`levels.level${level}`) }}</h3>
        <div class="switch__wrapper">
          <LangSwitch />
        </div>
        <h5>
            <span class="instructions__link">
              {{ $t('layout.author') }}
              <a href="https://github.com/ushliypakostnik" target="_blank">{{ $t('layout.authorlink') }}</a>
            </span>
        </h5>
        <!-- <div class="instructions__attention">{{ $t('layout.attention') }}</div> -->
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="instructions">
        <h3>{{ $t('layout.controls') }}</h3>
        <h4>{{ $t('layout.control1') }}</h4>
        <h4>{{ $t('layout.control2') }}</h4>
        <h4>{{ $t('layout.control3') }}</h4>
        <h4>{{ $t('layout.control4') }}</h4>
        <h4>{{ $t('layout.control5') }}</h4>
        <h4>{{ $t('layout.control6') }}</h4>
        <h4>{{ $t('layout.control7') }}</h4>
        <h4>{{ $t('layout.control8') }}</h4>
        <h4>{{ $t('layout.control9') }}</h4>
        <h4>{{ $t('layout.control10') }}</h4>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="instructions instructions--legend">
        <h3>{{ $t('layout.legend') }}</h3>
        <h4 v-html="$t('layout.legendtext')" />
      </div>
    </swiper-slide>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
</swiper>
</template>

<script>
import {mapGetters} from 'vuex';

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';

import { DESIGN } from '@/utils/constants';

import LangSwitch from '@/components/Layout/LangSwitch.vue';

import 'swiper/css/swiper.css';

export default {
  name: 'Instructions',

  components: {
    LangSwitch,
    Swiper,
    SwiperSlide,
  },

  directives: {
    swiper: directive,
  },

  data() {
    return {
      swiperOptions: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      level: 'layout/level',
    }),

    version() {
      return DESIGN.V;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_main.scss";

.instructions {
  text-align: center;
  color: $colors__white;

  &--legend {
    padding-left: 15vw;
    padding-right: 15vw;

    h4 {
      @include text($font-size--xsmall);
    }
  }

  &__attention {
    @include text($font-size--xsmall * 0.75);
  }
}

h3,
h4 {
  margin: 0;
}

h3 {
 margin-bottom: $gutter;
}
</style>
