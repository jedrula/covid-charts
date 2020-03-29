<template>
  <div ref="chart" />
</template>

<script>
/* eslint-disable no-undef */
// google is imported in index.html
// https://github.com/CSSEGISandData/COVID-19
export default {
  props: {
    to: {
      type: String,
      default: 'EUR',
    }
  },
  mounted() {
    google.charts.setOnLoadCallback(() => this.fetchAndDraw());
  },

  methods: {
    async fetchAndDraw() {
      const rows = await this.getCurrencyRows();
      this.drawBackgroundColor(rows)
    },

    drawBackgroundColor(rows) {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'X');
      data.addColumn('number', `PLN / ${this.to}`);

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Time',
          format: 'M/d',
        },
        vAxis: {
          title: 'PLN'
        },
        backgroundColor: '#f1f8e9'
      };

      var chart = new google.visualization.LineChart(this.$refs.chart);
      chart.draw(data, options);
    },

    async getCurrencyRows() {
      const res = await fetch(`https://api.exchangeratesapi.io/history?symbols=PLN&base=${this.to}&start_at=2020-02-27&end_at=2020-03-18`);
      const { rates } = await res.json()
      let dates = Object.keys(rates);
      dates.sort((a, b) => new Date(a) - new Date(b))
      return dates.map((date) => ([new Date(date), rates[date].PLN]))
    },
  }
}
</script>

<style scoped>

</style>
