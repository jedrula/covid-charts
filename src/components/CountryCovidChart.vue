<template>
  <div>
    <h1>{{country}} Deaths</h1>
    <LineChart :rows="deathsData" />
    <h1>{{country}} Confirmed</h1>
    <LineChart :rows="confirmedData" />
  </div>
</template>

<script>
import toPairs from 'lodash/toPairs';
import LineChart from './LineChart.vue';
import omit from 'lodash/omit';

function getCountryTimeSeries(row) {
  const datesData =  omit(row, ['Country/Region', 'Province/State', 'Lat', 'Long']);
  const pairs = toPairs(datesData);
  return pairs.map(([dateString, value]) => ([new Date(dateString), parseInt(value)]));
}

export default {
  props: {
    deathsRow: {
      type: Object,
      required: true,
    },
    confirmedRow: {
      type: Object,
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
    deathsData() {
      return getCountryTimeSeries(this.deathsRow);
    },
    confirmedData() {
      return getCountryTimeSeries(this.confirmedRow);
    },
    country() {
      return this.rowToCountry(this.deathsRow);
    },
  }
};
</script>
