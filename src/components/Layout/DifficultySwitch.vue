<template>
  <ul class="switch">
    <li
      class="switch__item"
      :class="value === difficulty && 'switch__item--active'"
      v-for="value in levels"
      v-bind:key="value"
    >
      <a v-if="value !== difficulty"
        href="#"
        @click.prevent="setDifficulty(value)"
      >{{ $t(`layout.difficulty.${value}`) }}</a>
      <span v-else>{{ $t(`layout.difficulty.${value}`) }}</span>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { DESIGN } from '@/utils/constants';

export default {
  name: 'DifficultySwitch',

  computed: {
    ...mapGetters({
      difficulty: 'layout/difficulty',
    }),

    levels() {
      return Object.values(DESIGN.DIFFICULTY);
    },
  },

  methods: {
    ...mapActions({
      setDifficulty: 'layout/setDifficulty',
    }),
  },
};
</script>
