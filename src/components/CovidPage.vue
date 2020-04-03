<template>
  <div v-if="!loaded">loading</div>
  <div v-else>
    <div v-for="(selectedIndex, index) in selectedIndexes" :key="index">
      <select v-model="selectedIndexes[index]">
        <option disabled value="">Please select Country + Province</option>
        <option v-for="(row, index) in covidDeathsJson" :key="index" :value="index">{{rowToCountry(row)}}</option>
      </select>
      <button @click="selectedIndexes.splice(index, 1)">Remove</button>
    </div>
    <button @click="selectedIndexes.push(0)">Add</button>
    <div>
      <input type="checkbox" id="checkbox" v-model="perMilionCount">
      <label for="checkbox">Per Milion</label>
    </div>
    <CountryCovidChart
      v-if="covidDeathsJson.length && selectedIndexes.length"
      :allDates="allDates"
      :deathsRows="selectedDeathRows"
      :confirmedRows="selectedConfirmedRows"
      :perMilionCount="perMilionCount"
      :rowToCountry="rowToCountry"
    />
    <div>
      <input type="radio" id="deathsChoice" value="deaths" v-model="statisticType">
      <label for="deathsChoice">Deaths</label>
      <input type="radio" id="confirmedChoice" value="confirmed" v-model="statisticType">
      <label for="confirmedChoice">Confirmed</label>
    </div>
    <div>
      <GeoChart :intensity="intensity"/>
    </div>
    <footer>
      <div>Covid data taken from <a target="_blank" href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE</a></div>
      <div>Population data taken from <a target="_blank" href="https://github.com/samayo/country-json/edit/master/src/country-by-population.json">country-json</a></div>
      <div>For feature requests or issues send me an email <a href="mailto:andrzej.swaton@gmail.com">andrzej.swaton@gmail.com</a></div>
    </footer>
  </div>
</template>

<script>
/* eslint-disable no-debugger */

import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import * as csv from "csvtojson";

import CountryCovidChart from './CountryCovidChart.vue';
import GeoChart from './GeoChart.vue';
import countryByPopulation from '../data/country-by-population.json';


/**
 * Finds population data entry that corresponds to thr covid data row.
 * I filter out those rows that do not have this data.
 * TODO make sure that all covid data has entries with population
 */
// TODO move to standalone file
const findPopulationData = (row) => {
  const covidCountry = rowToCountry(row);
  const populationEntry = countryByPopulation.find(({ country }) => country === covidCountry);
  if (populationEntry && populationEntry.population > 400000) {
    return populationEntry;
  }
}

const deathsGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
const confirmedGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

function getDatesData(row) {
  return omit(row, ['Country/Region', 'Province/State', 'Lat', 'Long']);
}

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

// TODO move to standalone file
function rowToCountry(row) {
  let option = row['Country/Region'];
  const province = row['Province/State'];
  if (province) {
    option += ` (${province})`;
  }
  return option;
}

const countryRows = (all, country) => all.filter(row => row['Country/Region'].includes(country))

function getSumForDate(rows, date) {
  return rows.map(row => row[date]).map(x => parseInt(x, 10)).reduce((total, single) => total + single, 0)
}

function getSums(rows, dates) {
  let sums = {};
  dates.forEach((date) => {
    sums[date] = getSumForDate(rows, date);
  })
  return sums;
}

function getSummedRow(allRows, country, dates) {
  const rows = countryRows(allRows, country);
  let row = {
    ['Province/State']: '',
    ['Country/Region']: country,
    Lat: 'TODO',
    Long: 'TODO',
  };
  const sums = getSums(rows, dates);
  return {
    ...row,
    ...sums,
  };
}

const countriesToSum = ['Australia', 'Canada', 'Congo', 'China'];

function withSummed(rows, dates) {
  const summedRows = countriesToSum.map((country) => getSummedRow(rows, country, dates));
  return [
    ...rows,
    ...summedRows,
  ];
}

function geoChartIntensity(rows, maxValue, date) {
  let intensity = {};
  rows.forEach((row) => {
    intensity[rowToCountry(row)] = row[date] / maxValue;
  });
  return intensity;
}

function perMilionRows(rows, populaionsInMillions) {
  return rows.map((row, rowIndex) => {
    const datesData = getDatesData(row);
    const perMilionValues = mapValues(datesData, value => Math.round(value / populaionsInMillions[rowIndex]))
    return { ...row, ...perMilionValues };
  })
}

export default {
  async beforeRouteEnter(to, from, next) {
    /* eslint-disable no-undef */
    // google is imported in index.html
    const loadGoogleChartsLib = new Promise((resolve) => google.charts.setOnLoadCallback(resolve));
    const [covidDeathsFetched, covidConfirmedFetched] = await Promise.all([
      getJsonFromCsvUrl(deathsGlobalUrl),
      getJsonFromCsvUrl(confirmedGlobalUrl),
      loadGoogleChartsLib
    ]);

    // Missing these:
    // Diamond Princess
    // Holy See
    // Montenegro
    // Serbia
    // Taiwan*
    // United Kingdom
    // West Bank and Gaza 
    // Kosovo
    // "MS Zaandam"
    // Plus All of those with provinces: Australia, Canada, China, Congo, France, Netherlands
    // console.log(countries);
    next((vm) => {
      vm.loaded = true;
      vm.covidDeathsFetched = covidDeathsFetched;
      vm.covidConfirmedFetched = covidConfirmedFetched;
    });
  },
  components: {
    CountryCovidChart,
    GeoChart,
  },
  data() {
    return {
      // Some explanation on perMilionCount
      // Say 300 died
      // nation has 40 milion
      // if it had 1 milion 40 times less would die so 300 / 40

      // Say 3 died
      // nation has 100'000
      // if it had 1 milion 30 would die
      perMilionCount: false,
      statisticType: 'deaths',
      loaded: false,
      covidDeathsFetched: [],
      covidConfirmedFetched: [],
      selectedIndexes: [
        36, // Czechia
        115, // Poland
      ],
    };
  },
  computed: {
    intensity() {
      return this.statisticType === 'deaths'
        ? this.geoChartDeathsIntensity
        : this.geoChartConfirmedIntensity;
    },
    allDates() {
      const datesData = getDatesData(this.covidDeathsFetched[0]);
      return Object.keys(datesData);
    },
    geoChartDate() {
      // TODO
      return this.allDates[this.allDates.length - 1];
    },
    maxValueDeaths() {
      const rowsWithValues = this.covidJson.deaths.map((row) => Object.values(getDatesData(row)));
      const maxes = rowsWithValues.map((values) => Math.max(...values));
      return Math.max(...maxes);
    },
    maxValueConfirmed() {
      const rowsWithValues = this.covidJson.confirmed.map((row) => Object.values(getDatesData(row)));
      const maxes = rowsWithValues.map((values) => Math.max(...values));
      return Math.max(...maxes);
    },
    geoChartDeathsIntensity() {
      return geoChartIntensity(this.covidJson.deaths, this.maxValueDeaths, this.geoChartDate);
    },
    geoChartConfirmedIntensity() {
      return geoChartIntensity(this.covidJson.confirmed, this.maxValueConfirmed ,this.geoChartDate);
    },
    covidDeathsFull() {
      return withSummed(this.covidDeathsFetched, this.allDates)
    },
    covidConfirmedFull() {
      return withSummed(this.covidConfirmedFetched, this.allDates)
    },
    covidDeathsJson() {
      return this.covidDeathsFull.filter(findPopulationData);
    },
    covidConfirmedJson() {
      return this.covidConfirmedFull.filter(findPopulationData);
    },
    covidDeathsJsonPerMilion() {
      return perMilionRows(this.covidDeathsJson, this.populationsInMillions);
    },
    covidConfirmedJsonPerMilion() {
      return perMilionRows(this.covidConfirmedJson, this.populationsInMillions);
    },
    covidJson() {
      return this.perMilionCount
        ? { confirmed: this.covidConfirmedJsonPerMilion, deaths: this.covidDeathsJsonPerMilion }
        : { confirmed: this.covidConfirmedJson, deaths: this.covidDeathsJson };
    },
    selectedDeathRows() {
      return this.selectedIndexes.map((selectedIndex) => this.covidJson.deaths[selectedIndex]);
    },
    selectedConfirmedRows() {
      return this.selectedIndexes.map((selectedIndex) => this.covidJson.confirmed[selectedIndex]);
    },
    populationsInMillions() {
      return this.covidDeathsJson.map(findPopulationData).map(({ population }) => (population / 1000000));
    },
  },
  methods: {
    rowToCountry,
  },
}
</script>

<style lang="scss" scoped>
footer {
  margin-top: 20px;
}
</style>