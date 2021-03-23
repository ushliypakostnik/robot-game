<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import Layout from './components/Layout/Layout';

export default {
  name: 'App',

  components: { Layout },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

#app {
  min-height: 100vh;
}
</style>
