<template>
  <div>
    <div>
      <input type="radio" id="one" value="LineChart" v-model="chartType">
      <label for="one">Line Chart</label>
      <input type="radio" id="two" value="ColumnChart" v-model="chartType">
      <label for="two">Column Chart</label>
    </div>
    <input type="checkbox" id="checkbox" v-model="perMilionCount">
    <label for="checkbox">Per Milion</label>
    <div class="dates-range">
      <span class="start-date-label">Adjust start date ({{startDate}})</span>
      <input type="range" min="0" :max="allDates.length - 2" v-model="minDateIndex">
    </div>
    <h1>{{countries}} {{deathsLabel}}</h1>
    <LineChart
      :rows="deathsData"
      :headerLabels="headerLabels"
      :vAxisTitle="deathsLabel"
      :chartType="chartType"
    />
    <h1>{{countries}} {{confirmedLabel}}</h1>
    <LineChart
      :rows="confirmedData"
      :headerLabels="headerLabels"
      :vAxisTitle="confirmedLabel"
      :chartType="chartType"
    />
  </div>
</template>

<script>
import omit from 'lodash/omit';
import LineChart from './LineChart.vue';

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
    selectedPopulations: {
      type: Array,
      required: true,
    },
  },
  components: {
    LineChart,
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
      minDateIndex: 0,
      chartType: 'LineChart',
    };
  },
  computed: {
    deathsLabel() {
      return this.perMilionCount ? 'Deaths (Per Milion)' : 'Deaths'
    },
    confirmedLabel() {
      return this.perMilionCount ? 'Confirmed cases (Per Milion)' : 'Confirmed cases'
    },
    allDates() {
      const datesData = getDatesData(this.deathsRows[0]);
      return Object.keys(datesData);
    },
    dates() {
      return this.allDates.slice(this.minDateIndex);
    },
    startDate() {
      return this.allDates[this.minDateIndex];
    },
    headerLabels() {
      return [
        { type: 'date', label: 'date' },
        ...this.countries.map((country) => ({ type: 'number', label: country })),
      ];
    },
    deathsData() {
      return this.dates.map((dateString) => ([new Date(dateString), ...this.deathsRows.map((row, rowIndex) => this.getValue(row, rowIndex, dateString))]));
    },
    confirmedData() {
      return this.dates.map((dateString) => ([new Date(dateString), ...this.confirmedRows.map((row, rowIndex) => this.getValue(row, rowIndex, dateString))]));
    },
    countries() {
      return this.deathsRows.map((row) => this.rowToCountry(row))
    },
    getValue() {
      return (row, rowIndex, dateString) => {
        const total = row[dateString];
        return this.perMilionCount
          ? Math.round(total / this.populaionsInMillions[rowIndex])
          : total;
      };
    },
    populaionsInMillions() {
      return this.selectedPopulations.map(data => (data.population / 1000000));
    },
  },
};
</script>

<style lang="scss" scoped>
.dates-range {
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-date-label {
  width: 200px;
  text-align: left;
}
</style>