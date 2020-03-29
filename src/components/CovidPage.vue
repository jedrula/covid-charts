<template>
  <div>
    <div>Covid page</div>
    <pre>{{ polishDeathsData }}</pre>
  </div>
</template>

<script>
import * as csv from "csvtojson";
import omit from 'lodash/omit';


const deathsGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';

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
      const datesData =  omit(this.polishCovid, ['Province/State', 'Lat', 'Long']);
      return datesData;
    },
  },
}
</script>