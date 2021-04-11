<template>
  <div class="ui">
    <div class="ui__background" />


    <div class="ui__optical-preload" />
    <div class="ui__optical"
      v-if="isOptical"
    >
      <div class="ui__optical--side" />
      <div class="ui__optical--center" />
      <div class="ui__optical--side" />
    </div>

    <div class="ui__things">
      <div class="ui__thing ui__thing--red">
        <div class="ui__thing-circle" />{{ flower(red) }}
      </div>
      <div class="ui__thing ui__thing--orange">
        <div class="ui__thing-circle" />{{ flower(orange) }}
      </div>
      <div class="ui__thing ui__thing--green">
        <div class="ui__thing-circle" />{{ flower(green) }}
      </div>
      <div class="ui__thing ui__thing--purple">
        <div class="ui__thing-circle" />{{ flower(purple) }}
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
    <div
      class="ui__ammo"
      :class="isGain && !isGameOver && 'effect'"
    >
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
          <span v-if="message[3]">
            {{ getObjectName(message[3]) }}
            <span v-if="getObjectType(message[3]) !== 'bottle'">{{ getObjectTypeName(message[3]) }}</span>
          </span>
        </div>

        <!-- "Постоянные" сообщения -->
        <div
          v-if="message[1] === 2"
          class="ui__message"
        >
          <span v-if="message[2] ==='open'">{{ $t(`messages.message${message[1]}.${message[2]}`) }}</span>
          <span v-if="message[2] ==='closed'">
            {{ $t(`messages.message${message[1]}.${message[2]}.${message[2]}1`) }}
            {{ $t(`objects.pass.${message[3]}`) }}
            {{ $t(`messages.message${message[1]}.${message[2]}.${message[2]}2`) }}
          </span>
          <span v-if="message[2] ==='cast'">
            {{ $t(`messages.message${message[1]}.${message[2]}`) }}
            {{ getObjectName(message[3]) }}
            <span v-if="getObjectType(message[3]) !== 'bottle'">{{ getObjectTypeName(message[3]) }}</span>
          </span>
          <span v-if="message[2] ==='look'">
            {{ $t(`messages.message${message[1]}.${message[2]}`) }}
            {{ $t(`objects.screen.declination`) }}
          </span>
        </div>

        <!-- Нумерованные сообщения связанные с положением в мире и врагами  -->
        <div
          v-if="message[1] === 3"
          class="ui__message ui__message--small"
        >
          {{message[0]}}: <span v-html="$t(`messages.message3.${message[2]}`)" />
          <span v-if="message[3]"> {{ $t(`objects.${message[3]}.declination`) }}</span>
        </div>
      </div>
    </div>

    <div
      class="ui__overlay"
      :class="[
        (isHeroOnDamage || isHeroOnHit)
        && !isNotDamaged && !isGameOver && `ui__overlay--damage damage`,
        isHeroOnUpgrade && `ui__overlay--upgrade upgrade`,
        isTimeMachine && `ui__overlay--effect effect`,
        isModal && `ui__overlay--modal fadeOn`,
        isGameOver && !isWin && `ui__overlay--gameover ui__overlay--fail`,
        isGameOver && isWin && `ui__overlay--gameover ui__overlay--win`,
      ]"
    >
      <h1 v-if="isGameOver && !isWin">{{ $t('layout.gameover') }}</h1>
      <h1
        v-else-if="isGameOver && isWin"
        v-html="$t('layout.win')"
      />

      <div
        v-if="isModal"
        class="ui__modal"
      >
        <div class="ui__modal-wrapper">
          <div class="ui__modal--left">
            <div class="ui__image-wrapper">
              <div class="ui__image-wrapper-wrapper">
                <img
                  :src="modalSrc(1)"
                  alt="image1"
                >
              </div>
            </div>
            <span v-html="$t(`modals.level${level}.modal${modalId}.text1`)" />
          </div>
          <div class="ui__modal--right">
            <span v-html="$t(`modals.level${level}.modal${modalId}.text2`)" />
            <div class="ui__image-wrapper">
              <div class="ui__image-wrapper-wrapper">
                <img
                  :src="modalSrc(2)"
                  alt="image2"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

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

import { getNotPartOfName } from '@/utils/utilities';


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

      red: 'hero/red',
      orange: 'hero/orange',
      green: 'hero/green',
      purple: 'hero/purple',

      passes: 'hero/passes',

      isHeroOnUpgrade: 'hero/isHeroOnUpgrade',

      isHeroTired: 'hero/isHeroTired',

      isOptical: 'hero/isOptical',

      isHeroOnDamage: 'hero/isHeroOnDamage',
      isHeroOnHit: 'hero/isHeroOnHit',

      isNotDamaged: 'hero/isNotDamaged',
      isNotTired: 'hero/isNotTired',
      isTimeMachine: 'hero/isTimeMachine',
      isGain: 'hero/isGain',

      level: 'layout/level',

      messages: 'layout/messages',

      isModal: 'layout/isModal',
      modalId: 'layout/modalId',

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
      setModal: 'layout/setModal',
      setGameOver: 'layout/setGameOver',

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

    getObjectName(name) {
      const objectType = this.getObjectType(name);
      const objectsName = getNotPartOfName(name, objectType);

      switch (objectType) {
        case OBJECTS.PASSES.name:
          return this.$t(`objects.pass.${objectsName}`);
        case OBJECTS.FLOWERS.name:
          return this.$t(`objects.flower.${objectsName}.name`);
        case OBJECTS.BOTTLES.name:
          return this.$t(`objects.${name}.declination`);
        default:
          return null;
      }
    },

    getObjectTypeName(name) {
      if (name.includes(OBJECTS.PASSES.name)) return this.$t('objects.pass.name');
      if (name.includes(OBJECTS.FLOWERS.name)) return this.$t('objects.flower.name');
      if (name.includes(OBJECTS.BOTTLES.name)) return this.$t('objects.bottle.declination');
      return null;
    },

    getObjectType(name) {
      if (name.includes(OBJECTS.PASSES.name)) return OBJECTS.PASSES.name;
      if (name.includes(OBJECTS.FLOWERS.name)) return OBJECTS.FLOWERS.name;
      if (name.includes(OBJECTS.BOTTLES.name)) return OBJECTS.BOTTLES.name;
      return null;
    },

    modalSrc(modal) {
      return `/images/modals/level1/modal${this.modalId}__${modal}.jpg`;
    },
  },

  watch: {
    health(value) {
      if (value < 0) this.setGameOver();
    },

    endurance(value) {
      if (value < 0) {
        this.setScale({
          field: 'isHeroTired',
          value: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_main.scss";

.ui {
  &,
  &__background,
  &__overlay,
  &__optical {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    @include size(100%, 100%);
  }

  &__background {
    background: rgba(112, 66, 20, 0.1);
    box-shadow: inset 0 0 $gutter * 6 $colors__black;
  }

  &__optical {
    display: flex;
    transform: scale(1.1, 1.1);

    &--side {
      background: $colors__black;
      flex-grow: 1;
      transform: scale(1.1, 1.1);
    }

    &--center {
      flex-grow: 0;
      background: url("#{$images__path}optical.png") no-repeat center top;
      background-size: cover;
      width: 100vh;
      height: 100vh;
    }

    &-preload {
      position: absolute;
      left: 99999px;
      opacity: 0;
      background: url("#{$images__path}optical.png") no-repeat center top;
    }
  }

  &__overlay {
    display: flex;
    justify-content: center;
    align-items: center;

    &--damage {
      background: $colors__primary-light--transparent;
    }

    &--fail {
      background: $colors__primary-light--transparent;
    }

    &--effect {
      background: $colors__white--transparent1;
    }

    &--upgrade {
      background: $colors__white--transparent2;
    }

    &--modal {
      color: $colors__white;
      background: $colors__black;
      padding-top: $gutter * 4;
      padding-bottom: $gutter * 3;
      overflow-y: auto;
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

  &__modal {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: $gutter / 10 solid $colors__white;
    padding: $gutter / 2;
    transform: translateY(-4vh);

    &--left {
      .ui__image-wrapper {
        transform: translateX(-3vw);
      }
    }

    &--right {
      .ui__image-wrapper {
        transform: translateX(3vw);
      }
    }

    &-wrapper {
      max-width: 70vw;
      display: flex;
      flex-direction: column;

      > div {
        display: flex;
        flex-direction: row;

        &:not(:last-child) {
          margin-bottom: $gutter;
        }

        img {
          width: 25vw;
          flex-grow: 0;
        }

        @media (max-height: 600px) {
          @include text($font-size--xsmall);
        }
      }
    }
  }

  &__image-wrapper {
    &-wrapper {
      background: $colors__black;
      border: $gutter / 10 solid $colors__white;
      padding: $gutter / 2;
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

    &--red .ui__thing-circle {
      background: $colors__red;
    }

    &--orange .ui__thing-circle {
      background: $colors__orange;
    }

    &--green .ui__thing-circle {
      background: $colors__green;
    }

    &--purple .ui__thing-circle {
      background: $colors__purple;
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
