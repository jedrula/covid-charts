<template>
  <div>
    <div>Covid page</div>
    <h1>Poland Deaths</h1>
    <LineChart :rows="polishDeathsData" />
    <h1>Poland Confirmed</h1>
    <LineChart :rows="polishConfirmedData" />


    <h1>Germany Deaths</h1>
    <LineChart :rows="germanyDeathsData" />
    <h1>Germany Confirmed</h1>
    <LineChart :rows="germanyConfirmedData" />

    <CountryCovidChart :country="country" />
  </div>
</template>

<script>
import * as csv from "csvtojson";
import omit from 'lodash/omit';
import toPairs from 'lodash/toPairs';
import LineChart from './LineChart.vue';
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

function getDataForCountry(json, country) {
  return json.find(row => row['Country/Region'] === country);
}

function getCountryTimeSeries(json, country) {
  const allData = getDataForCountry(json, country);
  const datesData =  omit(allData, ['Country/Region', 'Province/State', 'Lat', 'Long']);
  const pairs = toPairs(datesData);
  return pairs.map(([dateString, value]) => ([new Date(dateString), parseInt(value)]));
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
    LineChart,
    CountryCovidChart,
  },
  data() {
    return {
      covidDeathsJson: [],
      covidConfirmedJson: [],
      country: 'Poland',
    };
  },
  computed: {
    polishDeathsData() {
      return getCountryTimeSeries(this.covidDeathsJson, 'Poland');
    },
    polishConfirmedData() {
      return getCountryTimeSeries(this.covidConfirmedJson, 'Poland');
    },
    germanyDeathsData() {
      return getCountryTimeSeries(this.covidDeathsJson, 'Germany');
    },
    germanyConfirmedData() {
      return getCountryTimeSeries(this.covidConfirmedJson, 'Germany');
    },
  },
}
</script>