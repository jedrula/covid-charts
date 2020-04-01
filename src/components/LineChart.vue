<template>
  <div ref="chart" />
</template>

<script>
import get from 'lodash/get';

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
    },
    chartType: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.$watch('chart', this.drawChart, { immediate: true });
    // TODO destroy ?
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
      /* eslint-disable no-undef */
      // google is imported in index.html
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
    chart() {
      return new google.visualization[this.chartType](this.$refs.chart);
    },
  },

  methods: {
    drawChart() {
      this.chart.draw(this.chartData, this.options);
    },
  }
}
</script>
