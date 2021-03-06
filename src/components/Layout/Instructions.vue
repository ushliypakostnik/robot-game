<template>
  <swiper
    class="swiper"
    :options="swiperOptions"
  >
    <swiper-slide>
      <div class="instructions">
        <!-- <h1>{{ $t('layout.title') }} {{ version }}</h1> -->
        <h1>{{ $t('layout.title') }}</h1>
        <h3>{{ $t(`texts.level${level}.header`) }}</h3>
        <h5>{{ $t(`texts.level${level}.subheader`) }}</h5>
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
        <h4>{{ $t('layout.control11') }}</h4>
      </div>
    </swiper-slide>
    <swiper-slide>
      <div class="instructions instructions--legend">
        <h3>{{ $t('layout.legend') }}</h3>
        <h4 v-html="$t('layout.legendtext')" />
      </div>
    </swiper-slide>

    <swiper-slide>
      <div class="instructions">
        <h3>{{ $t('layout.rules') }}</h3>
        <h4>{{ $t('layout.weight') }}{{ maxWeight }}</h4>
        <div class="instructions__block instructions--red">
          <div class="instructions__circle" />
          <div class="instructions__text">
            {{ $t(`objects.flower.red.name`) }}
            {{ $t(`objects.flower.name`) }}
            <span v-html="$t(`objects.flower.red.text`)" />
          </div>
        </div>
        <div class="instructions__block instructions--orange">
          <div class="instructions__circle" />
          <div class="instructions__text">
            {{ $t(`objects.flower.orange.name`) }}
            {{ $t(`objects.flower.name`) }}
            <span v-html="$t(`objects.flower.orange.text`)" />
          </div>
        </div>
        <div class="instructions__block instructions--green">
          <div class="instructions__circle" />
          <div class="instructions__text">
            {{ $t(`objects.flower.green.name`) }}
            {{ $t(`objects.flower.name`) }}
            <span v-html="$t(`objects.flower.green.text`)" />
          </div>
        </div>
        <div class="instructions__block instructions--purple">
          <div class="instructions__circle" />
          <div class="instructions__text">
            {{ $t(`objects.flower.purple.name`) }}
            {{ $t(`objects.flower.name`) }}
            <span v-html="$t(`objects.flower.purple.text`)" />
          </div>
        </div>
        <div class="instructions__block instructions--bottle">
          <div class="instructions__circle" />
          <div class="instructions__text">
            {{ $t(`objects.bottle.name`) }}
            <span v-html="$t(`objects.bottle.text`)" />
          </div>
        </div>
      </div>
    </swiper-slide>

    <swiper-slide>
      <div class="instructions">
        <h3>{{ $t('layout.settings') }}</h3>
        <h4 v-html="$t('layout.difficulty.title')" />
        <div class="switch__wrapper">
          <DifficultySwitch />
        </div>
        <h5 class="small">{{ $t('layout.difficultytext') }}{{ time }} {{ $t('layout.difficultytext2') }}</h5>
        <h5
          class="small"
          v-html="$t('layout.difficultytext3')"
        />
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
import DifficultySwitch from '@/components/Layout/DifficultySwitch.vue';

import 'swiper/css/swiper.css';

export default {
  name: 'Instructions',

  components: {
    Swiper,
    SwiperSlide,
    LangSwitch,
    DifficultySwitch,
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
      difficulty: 'layout/difficulty',
      level: 'layout/level',
    }),

    version() {
      return DESIGN.V;
    },

    maxWeight() {
      return DESIGN.HERO.MAXWEIGHT;
    },

    time() {
      return DESIGN.EFFECTS.time[this.difficulty];
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

  &__block {
    margin-bottom: $gutter * 2/3;
  }

  &__text {
    max-width: 40vw;
    @include text($font-size--xsmall * 0.85);
  }

  &__circle {
    $size: $gutter / 2;

    margin: 0 auto $gutter / 4;
    min-width: $size;
    border-radius: 50%;
    @include size($size, $size);
  }

  &--red {
    .instructions__circle {
      background: $colors__red;
    }
  }

  &--orange {
    .instructions__circle {
      background: $colors__orange;
    }
  }

  &--green {
    .instructions__circle {
      background: $colors__green;
    }
  }

  &--purple {
    .instructions__circle {
      background: $colors__purple;
    }
  }

  &--bottle {
    .instructions__circle {
      background: $colors__primary;
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

h4 {
  margin-bottom: $gutter / 2;
}

h3 {
  margin-bottom: $gutter / 2;
}

h5 {
  margin-bottom: $gutter;

  &.small {
    margin-top: $gutter / 4;
    margin-bottom: $gutter / 4;
  }
}
</style>
