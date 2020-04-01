<template>
  <div ref="chart" />
</template>

<script>
import get from 'lodash/get';
// https://www.npmjs.com/package/vue-multiselect

/* eslint-disable no-undef */
// google is imported in index.html
// https://github.com/CSSEGISandData/COVID-19
export default {
  props: {
    rows: {
      type: Array,
      required: true,
    },
    headerLabels: {
      type: Array,
      required: true,
    },
    vAxisTitle: {
      type: String,
      required: true,
    },
    incremental: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    google.charts.setOnLoadCallback(() => this.drawChart());
  },

  watch: {
    chartData() {
      this.drawChart();
    },
  },

  computed: {
    rowsIncremental() {
      return this.rows.map(([date, ...values], index) => {
        const newValues = values.map((value, valueIndex) => {
          const prevValue = get(this.rows, [index - 1, valueIndex + 1]);
          return value - prevValue;
        });
        return [date, ...newValues];
      });
    },
    chartData() {
      return new google.visualization.arrayToDataTable([this.headerLabels, ...this.shownRows]);
    },
    shownRows() {
      return this.incremental ? this.rowsIncremental : this.rows;
    },
    options() {
      return {
        hAxis: {
          title: 'Date',
          format: 'dd.MM',
        },
        vAxis: {
          title: this.vAxisTitle,
        },
        backgroundColor: '#f1f8e9'
      };
    },
  },

  methods: {
    drawChart() {
      const chart = new google.visualization.ColumnChart(this.$refs.chart);
      chart.draw(this.chartData, this.options);
    },
  }
}
</script>
