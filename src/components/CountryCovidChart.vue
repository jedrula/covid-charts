<template>
  <div>
    <h1>{{countries}} Deaths</h1>
    <LineChart :rows="deathsData" :headerLabels="headerLabels"/>
    <h1>{{countries}} Confirmed</h1>
    <LineChart :rows="confirmedData" :headerLabels="headerLabels"/>
  </div>
</template>

<script>
import LineChart from './LineChart.vue';
import omit from 'lodash/omit';

function getDatesData(row) {
  return omit(row, ['Country/Region', 'Province/State', 'Lat', 'Long']);
}

export default {
  props: {
    deathsRows: {
      type: Array,
      required: true,
    },
    confirmedRows: {
      type: Array,
      required: true,
    },
    rowToCountry: {
      type: Function,
      required: true,
    },
  },
  components: {
    LineChart,
  },
  computed: {
    dates() {
      const datesData = getDatesData(this.deathsRows[0]);
      return Object.keys(datesData);
    },
    headerLabels() {
      return [
        { type: 'date', label: 'date' },
        ...this.countries.map((country) => ({ type: 'number', label: country })),
      ];
    },
    deathsData() {
      return this.dates.map((dateString) => ([new Date(dateString), ...this.deathsRows.map((row) => row[dateString])]));
    },
    confirmedData() {
      return this.dates.map((dateString) => ([new Date(dateString), ...this.confirmedRows.map((row) => row[dateString])]));
    },
    countries() {
      return this.deathsRows.map((row) => this.rowToCountry(row))
    },
  }
};
</script>
