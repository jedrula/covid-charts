<template>
  <div>
    <h1>Dates</h1>
    {{ dates }}
    <h1>{{countries}} Deaths</h1>
    <LineChart :rows="deathsData" :headerLabels="headerLabels"/>
    <h1>{{countries}} Confirmed</h1>
    <LineChart :rows="confirmedData" :headerLabels="headerLabels"/>
  </div>
</template>

<script>
import toPairs from 'lodash/toPairs';
import LineChart from './LineChart.vue';
import omit from 'lodash/omit';

function getDatesData(row) {
  return omit(row, ['Country/Region', 'Province/State', 'Lat', 'Long']);
}

function getCountryTimeSeries(row) {
  const datesData =  getDatesData(row);
  const pairs = toPairs(datesData);
  return pairs.map(([dateString, value]) => ([new Date(dateString), parseInt(value)]));
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
      return getCountryTimeSeries(this.deathsRows[0]);
    },
    confirmedData() {
      return getCountryTimeSeries(this.confirmedRows[0]);
    },
    countries() {
      return this.deathsRows.map((row) => this.rowToCountry(row))
    },
  }
};
</script>
