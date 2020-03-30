<template>
  <div ref="chart" />
</template>

<script>
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
  },
  mounted() {
    google.charts.setOnLoadCallback(() => this.drawChart());
  },

  watch: {
    rows() {
      this.drawChart();
    },
  },

  methods: {
    drawChart() {
      const data = new google.visualization.arrayToDataTable([this.headerLabels, ...this.rows]);

      const options = {
        hAxis: {
          title: 'Time',
          format: 'dd.MM',
        },
        vAxis: {
          title: 'count'
        },
        backgroundColor: '#f1f8e9'
      };

      const chart = new google.visualization.LineChart(this.$refs.chart);
      chart.draw(data, options);
    },
  }
}
</script>
