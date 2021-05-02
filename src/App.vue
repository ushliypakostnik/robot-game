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
#app {
  min-height: 100vh;
}
</style>
