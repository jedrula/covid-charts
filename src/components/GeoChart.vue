<template>
<div>
  <div class="colors">
    <div v-for="color in colors" :style="{ background: color }" :key="color" class="color"></div>
  </div>
  <svg
    xmlns:mapsvg="http://mapsvg.com"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    mapsvg:geoViewBox="-169.110266 83.600842 190.486279 -58.508473"
    width="1009.6727"
    height="665.96301">

    <path v-for="country in countries"
      :key="country"
      :d="countriesPaths[country]"
      :style="{ fill: getTresholdColor(intensity[country]) }"
    />
  </svg>
</div>
</template>

<script>
import countriesPaths from './countries-paths.json';
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
export default {
  props: {
    intensity: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.colorData = [['#A8FF33', 0.05], ['#DBFF33', 0.1], ['#FFF033', 0.25], ['#FFBD33', 0.5], ['#FF8A33', 0.7], ['#FF5733', 1]];
    this.countriesPaths = countriesPaths;
  },

  computed: {
    countries() {
      return Object.keys(this.intensity);
    },
    tresholds() {
      return this.colorData.map(([color, treshold]) => treshold);
    },
    colors() {
      return this.colorData.map(([color]) => color);
    },
  },

  methods: {
    getTresholdColor(value) {
      return this.colorData.find(([color, treshold]) => (treshold >= value))[0];
    },
  },
}
</script>

<style lang="scss" scoped>

.colors {
  display: flex;
}

.color {
  width: 100px;
  height: 30px;
}
</style>