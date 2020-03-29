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

async function getCsvTextFromUrl(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text
}

async function getJsonFromCsvUrl(url) {
  const csvText = await getCsvTextFromUrl(url);
  const json =  await csv().fromString(csvText);
  return json;
}

export default {
  async beforeRouteEnter(to, from, next) {
    const covidDeathsJson = await getJsonFromCsvUrl(deathsGlobalUrl);
    next((vm) => {
      vm.covidDeathsJson = covidDeathsJson
    });
  },
  components: {
    LineChart,
  },
  data() {
    return {
      covidDeathsJson: [],
    };
  },
  computed: {
    polishCovid() {
      return this.covidDeathsJson.find(row => row['Country/Region'] === 'Poland');
    },
    polishDeathsData() {
      const datesData =  omit(this.polishCovid, ['Country/Region', 'Province/State', 'Lat', 'Long']);
      const pairs = toPairs(datesData);
      return pairs.map(([dateString, value]) => ([new Date(dateString), parseInt(value)]));
    },
  },
}
</script>