<template>
  <div id="app">
    <CurrencyChart to="EUR"/>
  </div>
</template>

<script>
import CurrencyChart from './components/CurrencyChart.vue'

export default {
  components: {
    CurrencyChart
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
