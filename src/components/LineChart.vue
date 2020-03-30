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
  },
  mounted() {
    google.charts.setOnLoadCallback(() => this.drawChart(this.rows));
  },

  watch: {
    rows() {
      this.drawChart(this.rows);
    },
  },

  methods: {
    drawChart(rows) {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'X');
      data.addColumn('number', 'TODO');

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Time',
          format: 'dd.MM',
        },
        vAxis: {
          title: 'count'
        },
        backgroundColor: '#f1f8e9'
      };

      var chart = new google.visualization.LineChart(this.$refs.chart);
      chart.draw(data, options);
    },
  }
}
</script>
