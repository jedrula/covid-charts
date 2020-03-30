<template>
  <div>
    <div v-for="(selectedIndex, index) in selectedIndexes" :key="index">
      <select v-model="selectedIndexes[index]">
        <option disabled value="">Please select Country + Province</option>
        <option v-for="(row, index) in covidDeathsJson" :key="index" :value="index">{{rowToCountry(row)}}</option>
      </select>
    </div>
    <button @click="selectedIndexes.push(0)">Add</button>
    <CountryCovidChart
      v-if="covidDeathsJson.length && selectedIndexes.length"
      :deathsRows="selectedIndexes.map((selectedIndex) => covidDeathsJson[selectedIndex])"
      :confirmedRows="selectedIndexes.map((selectedIndex) => covidConfirmedJson[selectedIndex])"
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
      selectedIndexes: [],
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