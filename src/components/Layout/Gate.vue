<template>
  <div class="gate">
    <h3 v-if="face === 'gadgets'">{{ $t('layout.gadgetsgate') }}</h3>
    <h3 v-else-if="face === 'chrome'">{{ $t('layout.chromegate') }}</h3>
  </div>
</template>

<script>
export default {
  name: 'Gate',

  props: {
    face: {
      type: String,
      default: null,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/_main.scss";

.gate {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $colors__black;
  color: $colors__white;
  padding-left: 10vw;
  padding-right: 10vw;
  width: 100vw;
  height: 100vh;
}

h3 {
  text-align: center;
}
</style>
