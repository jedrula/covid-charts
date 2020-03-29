<template>
  <div id="app">
    <div class="navigation">
      <router-link to="/currencies">Go to Currencies</router-link>
      <router-link to="/covid">Go to Covid</router-link>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.chart {
  width: 50%;
  display: inline-flex;
}

.navigation {
  display: flex;
  justify-content: center;

  > * {
    margin: 0 10px;
  }
}
</style>
