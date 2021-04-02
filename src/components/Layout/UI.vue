<template>
  <div class="ui">
    <div class="ui__things">
      <div class="ui__thing ui__thing--daffodils">
        <div class="ui__thing-circle" />{{ flower(daffodil) }}
      </div>
      <div class="ui__thing ui__thing--anemones">
        <div class="ui__thing-circle" />{{ flower(anemone) }}
      </div>
      <div class="ui__thing ui__thing--crocuses">
        <div class="ui__thing-circle" />{{ flower(crocus) }}
      </div>
      <div class="ui__thing ui__thing--tulips">
        <div class="ui__thing-circle" />{{ flower(tulip) }}
      </div>
    </div>

    <div class="ui__passes">
      <div
        :class="isPass('red') && 'ui__pass--on'"
        class="ui__pass ui__pass--red"
      />
      <div
        :class="isPass('orange') && 'ui__pass--on'"
        class="ui__pass ui__pass--orange"
      />
      <div
        :class="isPass('green') && 'ui__pass--on'"
        class="ui__pass ui__pass--green"
      />
      <div
        :class="isPass('purple') && 'ui__pass--on'"
        class="ui__pass ui__pass--purple"
      />
      <div
        :class="isPass('blue') && 'ui__pass--on'"
        class="ui__pass ui__pass--blue"
      />
    </div>

    <div class="ui__scales">
      <Scale
        face="health"
        :progress="!isGameOver ? health : 0"
        :not="isNotDamaged && !isGameOver"
      />
      <Scale
        face="endurance"
        :progress="endurance"
        :lock="isHeroTired && !isGameOver"
        :not="isNotTired && !isGameOver"
      />
    </div>
    <div class="ui__ammo">
      {{ ammo }}/{{ ammoMagazine }}
    </div>

    <div
      v-if="!isGameOver"
      class="ui__messages"
    >
      <div
        :key="index"
        class="ui__message-wrapper"
        v-for="message, index in messages"
      >
        <!-- Нумерованные "исчезающие" сообщения  -->
        <div
          v-if="message[1] === 1"
          class="ui__message ui__message--small"
        >
          {{message[0]}}: <span v-html="$t(`messages.message${message[1]}.${message[2]}`)" />
          <span v-if="message[3]"> {{ getMessage1ByName(message[3]) }}</span>
          <span v-if="isPickPass(message[3])">{{ $t(`messages.passes.pass`) }}</span>
        </div>

        <!-- "Постоянные" сообщения -->
        <div
          v-if="message[1] === 2"
          class="ui__message"
        >
          <span v-if="message[2] ==='open'">{{ $t(`messages.message${message[1]}.${message[2]}`) }}</span>
          <span v-if="message[2] ==='closed'">
            {{ $t(`messages.message${message[1]}.${message[2]}.${message[2]}1`) }}
            {{ $t(`messages.passes.${message[3]}`) }}
            {{ $t(`messages.message${message[1]}.${message[2]}.${message[2]}2`) }}
          </span>
          <span v-if="message[2] ==='cast'">
            {{ $t(`messages.message${message[1]}.${message[2]}`) }}
            {{ getMessage2ByName(message[3]) }}
            <span v-if="isCastPass(message[3])">{{ $t(`messages.passes.pass`) }}</span>
          </span>
        </div>
      </div>
    </div>

    <div
      class="ui__overlay"
      :class="[
        (isHeroOnDamage || isHeroOnHit)
        && !isNotDamaged && !isGameOver && `ui__overlay--damage damage`,
        isHeroOnUpgrade && `ui__overlay--upgrade upgrade`,
        isGameOver && !isWin && `ui__overlay--gameover ui__overlay--fail`,
        isGameOver && isWin && `ui__overlay--gameover ui__overlay--win`,
      ]"
    >
      <h1 v-if="isGameOver && !isWin">{{ $t('layout.gameover') }}</h1>
      <h1
        v-else-if="isGameOver && isWin"
        v-html="$t('layout.win')"
      />
      <button
        class="button"
        type="button"
        v-if="isGameOver"
        @click.prevent.stop="reload()"
      >{{ $t('layout.gameovebuttonStart') }}</button>
      <!-- <button
        class="button"
        type="button"
        v-if="isGameOver"
        @click.prevent.stop="reload()"
      >{{ $t('layout.gameovebuttonNext') }}</button> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { DESIGN, OBJECTS } from '@/utils/constants';

import Scale from '@/components/Layout/Scale.vue';

export default {
  name: 'UI',

  components: {
    Scale,
  },

  computed: {
    ...mapGetters({
      health: 'hero/health',
      endurance: 'hero/endurance',
      ammo: 'hero/ammo',

      anemone: 'hero/anemone',
      crocus: 'hero/crocus',
      daffodil: 'hero/daffodil',
      tulip: 'hero/tulip',

      passes: 'hero/passes',

      isHeroOnUpgrade: 'hero/isHeroOnUpgrade',

      isHeroTired: 'hero/isHeroTired',

      isHeroOnDamage: 'hero/isHeroOnDamage',
      isHeroOnHit: 'hero/isHeroOnHit',

      isNotDamaged: 'hero/isNotDamaged',
      isNotTired: 'hero/isNotTired',

      messages: 'layout/messages',

      isGameOver: 'layout/isGameOver',
      isWin: 'layout/isWin',
    }),

    ammoMagazine() {
      const magazine = Math.floor((this.ammo - 1) / DESIGN.EFFECTS.bottle.ammo) + 1;
      return magazine < 10 ? `0${magazine}` : magazine;
    },
  },

  methods: {
    ...mapActions({
      setGameOver: 'layout/setGameOver',

      setHeroTired: 'hero/setHeroTired',
      setScale: 'hero/setScale',
    }),

    reload() {
      window.location.reload();
    },

    flower(value) {
      return value < 10 ? `0${value}` : value;
    },

    isPass(pass) {
      return this.passes.includes(DESIGN.PASSES[pass]);
    },

    isCastPass(name) {
      if (name.includes(OBJECTS.PASSES.name)) return true;
      return false;
    },

    isPickPass(name) {
      switch (name) {
        case DESIGN.PASSES.red:
        case DESIGN.PASSES.orange:
        case DESIGN.PASSES.green:
        case DESIGN.PASSES.purple:
        case DESIGN.PASSES.blue:
          return true;
        default:
          return false;
      }
    },

    getMessage1ByName(name) {
      switch (name) {
        case DESIGN.PASSES.red:
        case DESIGN.PASSES.orange:
        case DESIGN.PASSES.green:
        case DESIGN.PASSES.purple:
        case DESIGN.PASSES.blue:
          return this.$t(`messages.passes.${name}`);
        default:
          return null;
      }
    },

    getMessage2ByName(name) {
      if (name.includes(OBJECTS.PASSES.name)) {
        if (name.includes(DESIGN.PASSES.red)) return this.$t('messages.passes.red');
        if (name.includes(DESIGN.PASSES.orange)) return this.$t('messages.passes.orange');
        if (name.includes(DESIGN.PASSES.green)) return this.$t('messages.passes.green');
        if (name.includes(DESIGN.PASSES.purple)) return this.$t('messages.passes.purple');
        if (name.includes(DESIGN.PASSES.blue)) return this.$t('messages.passes.blue');
      }

      switch (name) {
        case OBJECTS.ANEMONES.name:
        case OBJECTS.CROCUSES.name:
        case OBJECTS.DAFFODILS.name:
        case OBJECTS.TULIPS.name:
          return this.$t(`things.${name}.name`);
        case OBJECTS.BOTTLES.name:
          return this.$t(`things.${name}.declination`);
        default:
          return null;
      }
    },
  },

  watch: {
    health(value) {
      if (value < 0) this.setGameOver();
    },

    endurance(value) {
      if (value < 0) this.setHeroTired(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_main.scss";

.ui {
  &,
  &__overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    @include size(100%, 100%);
  }

  &__overlay {
    &--damage {
      background: $colors__primary-light--transparent;
    }

    &--fail {
      background: $colors__primary-light--transparent;
    }

    &--upgrade {
      background: $colors__white--transparent2;
    }

    &--win {
      background: $colors__crocus--transparent;
    }

    &--gameover {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      h1 {
        text-align: center;
        margin-top: $gutter * 2;
        color: $colors__white;
        @include text($font-size--large * 2);
      }

      .button {
        margin-bottom: 0;
      }
    }
  }

  &__scales {
    position: absolute;
    bottom: $gutter / 2;
    left: $gutter / 2;
    width: $gutter * 8;
  }

  &__ammo {
    position: absolute;
    bottom: 0;
    right: $gutter / 2;
    color: $colors__white;
    text-shadow: 1px 2px 3px $colors__shadows;
    @include text($font-size--large);
  }

  &__messages {
    max-width: 50%;
    position: absolute;
    top: $gutter / 2;
    right: $gutter / 2;
    text-align: right;
  }

  &__message {
    color: $colors__white;
    text-shadow: 2px 2px 5px $colors__shadows;
    margin-bottom: $gutter / 2;
    @include text($font-size--normal);

    &--small {
      @include text($font-size--small);
    }

    &--xsmall {
      @include text($font-size--xsmall);
    }

    &--warning {
      color: $colors__primary--light;
    }
  }

  &__things {
    position: absolute;
    top: $gutter / 2;
    left: $gutter / 2;
    display: flex;
  }

  &__thing {
    display: flex;
    align-items: center;
    color: $colors__white;
    margin-right: $gutter;
    text-shadow: 1px 2px 3px $colors__shadows;
    @include text($font-size--small);

    &-circle {
      margin-right: $gutter / 4;
      border-radius: 50%;
      transform: translateY($gutter * -0.05);
      box-shadow: 0 1px 3px $colors__shadows--light;
      @include size($gutter / 2, $gutter / 2);
    }

    &--anemones {
      .ui__thing-circle {
        background: $colors__anemone;
      }
    }

    &--crocuses {
      .ui__thing-circle {
        background: $colors__crocus;
      }
    }

    &--daffodils {
      .ui__thing-circle {
        background: $colors__daffodil;
      }
    }

    &--tulips {
      .ui__thing-circle {
        background: $colors__tulip;
      }
    }
  }

  &__passes {
    position: absolute;
    top: $gutter * 2;
    left: $gutter / 2;
    display: flex;
  }

  &__pass {
    opacity: 0.33;
    margin-right: $gutter;
    box-shadow: 0 1px 3px $colors__shadows--light;
    @include size($gutter / 2, $gutter / 2);

    &--red {
      background: $colors__red;
    }

    &--orange {
      background: $colors__orange;
    }

    &--green {
      background: $colors__green;
    }

    &--purple {
      background: $colors__purple;
    }

    &--blue {
      background: $colors__blue;
    }

    &--on {
      opacity: 1;
    }
  }
}
</style>
