<template>
  <div>
    <div>
      <input type="radio" id="one" value="LineChart" v-model="chartType">
      <label for="one">Line Chart</label>
      <input type="radio" id="two" value="ColumnChart" v-model="chartType">
      <label for="two">Column Chart</label>
    </div>
    <div>
      <input type="radio" id="three" :value="true" v-model="incremental">
      <label for="three">Daily</label>
      <input type="radio" id="four" :value="false" v-model="incremental">
      <label for="four">Total</label>
    </div>
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
      :incremental="incremental"
    />
    <h1>{{countries}} {{confirmedLabel}}</h1>
    <LineChart
      :rows="confirmedData"
      :headerLabels="headerLabels"
      :vAxisTitle="confirmedLabel"
      :chartType="chartType"
      :incremental="incremental"
    />
  </div>
</template>

<script>
import LineChart from './LineChart.vue';

export default {
  props: {
    allDates: {
      type: Array,
      required: true,
    },
    deathsRows: {
      type: Array,
      required: true,
    },
    confirmedRows: {
      type: Array,
      required: true,
    },
    perMilionCount: {
      type: Boolean,
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
  data() {
    return {
      minDateIndex: 0,
      chartType: 'LineChart',
      incremental: false,
    };
  },
  computed: {
    deathsLabel() {
      return this.perMilionCount ? 'Deaths (Per Milion)' : 'Deaths'
    },
    confirmedLabel() {
      return this.perMilionCount ? 'Confirmed cases (Per Milion)' : 'Confirmed cases'
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
      return this.dates.map((dateString) => ([new Date(dateString), ...this.deathsRows.map((row) =>  row[dateString])]));
    },
    confirmedData() {
      return this.dates.map((dateString) => ([new Date(dateString), ...this.confirmedRows.map((row) =>  row[dateString])]));
    },
    countries() {
      return this.deathsRows.map((row) => this.rowToCountry(row))
    },// TODO move radio button ???? or already moved ?
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