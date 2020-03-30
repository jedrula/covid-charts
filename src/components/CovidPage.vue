<template>
  <div>
    <select v-model="selectedIndex">
      <option disabled value="">Please select Country + Province</option>
      <option v-for="(row, index) in covidDeathsJson" :key="index" :value="index">{{rowToCountry(row)}}</option>
    </select>
    <CountryCovidChart
      v-if="covidDeathsJson.length"
      :deathsRows="[covidDeathsJson[selectedIndex], covidDeathsJson[selectedIndex + 1]]"
      :confirmedRows="[covidConfirmedJson[selectedIndex], covidConfirmedJson[selectedIndex + 1]]"
      :rowToCountry="rowToCountry"
    />
  </div>
</template>

<script>
import * as csv from "csvtojson";

import CountryCovidChart from './CountryCovidChart.vue';


const deathsGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const confirmedGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

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
    const [covidDeathsJson, covidConfirmedJson] = await Promise.all([getJsonFromCsvUrl(deathsGlobalUrl), getJsonFromCsvUrl(confirmedGlobalUrl)]);
    next((vm) => {
      vm.covidDeathsJson = covidDeathsJson
      vm.covidConfirmedJson = covidConfirmedJson;
    });
  },
  components: {
    CountryCovidChart,
  },
  data() {
    return {
      covidDeathsJson: [],
      covidConfirmedJson: [],
      selectedIndex: 0,
    };
  },
  methods: {
    rowToCountry(row) {
      let option = row['Country/Region'];
      const province = row['Province/State'];
      if (province) {
        option += ` (${province})`;
      }
      return option;
    },
  },
}
</script>