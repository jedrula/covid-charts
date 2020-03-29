<template>
  <div>
    <div>Covid page</div>
    <LineChart :rows="polishDeathsData" />
    <pre>{{ polishDeathsData }}</pre>
  </div>
</template>

<script>
import * as csv from "csvtojson";
import omit from 'lodash/omit';
import toPairs from 'lodash/toPairs';
import LineChart from './LineChart.vue';


const deathsGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
// const confirmedGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';

async function getCovidCsvText() {
  const response = await fetch(deathsGlobalUrl);
  const text = await response.text();
  return text
}

// TODO remove ? It' s one-liner
async function csvToJson(csvText) {
  const json = await csv().fromString(csvText);
  return json;
}

export default {
  async beforeRouteEnter(to, from, next) {
    const covidCsv = await getCovidCsvText();
    const covidJson = await csvToJson(covidCsv);
    next(vm => vm.covidJson = covidJson)
  },
  components: {
    LineChart,
  },
  data() {
    return {
      covidJson: [],
    };
  },
  computed: {
    polishCovid() {
      return this.covidJson.find(row => row['Country/Region'] === 'Poland');
    },
    polishDeathsData() {
      const datesData =  omit(this.polishCovid, ['Country/Region', 'Province/State', 'Lat', 'Long']);
      const pairs = toPairs(datesData);
      return pairs.map(([dateString, value]) => ([new Date(dateString), parseInt(value)]));
    },
  },
}
</script>