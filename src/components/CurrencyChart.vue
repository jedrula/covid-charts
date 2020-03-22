<template>
  <div ref="chart" />
</template>

<script>
/* eslint-disable no-undef */
// google is imported in index.html
export default {
  props: {
    to: {
      type: String,
      required: true,
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
      data.addColumn('number', 'X');
      data.addColumn('number', `PLN / ${this.to}`);

      data.addRows(rows);

      var options = {
        hAxis: {
          title: 'Time'
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
      return dates.map((date, index) => ([index, rates[date].PLN]))
    },
  }
}
</script>

<style scoped>

</style>
