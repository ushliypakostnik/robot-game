<template>
  <div class="ui">
    <div class="ui__messages">
      <div
        v-for="message, index in messages"
        :key="index"
        class="ui__message-wrapper"
      >
        <!-- "Постоянные" сообщения -->
        <div
          v-if="message[1] === 1"
          class="ui__message"
        >
          {{ $t(`messages.message${message[1]}`) }}
        </div>

        <!-- Нумерованные "исчезающие" сообщения  -->
        <div
          v-if="message[1] === 2"
          class="ui__message ui__message--small"
        >
          {{message[0]}}: <span v-html="$t(`messages.message2.${message[2]}`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { DESIGN, OBJECTS } from '@/utils/constants';

// import Component from '@/components/Layout/Component.vue';

export default {
  name: 'UI',

  components: {
  },

  computed: {
    ...mapGetters({
      messages: 'layout/messages',
    }),
  },

  methods: {
    ...mapActions({
    }),
  },

  watch: {
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/_main.scss";

.ui {
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
}
</style>
