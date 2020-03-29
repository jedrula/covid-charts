<template>
  <div>
    <h1>{{country}} Deaths</h1>
    <!-- <LineChart :rows="polishDeathsData" /> -->
    <h1>{{country}} Confirmed</h1>
    <!-- <LineChart :rows="polishConfirmedData" /> -->
  </div>
</template>

<script>
export default {
  props: {
    country: {
      type: String,
      required: true,
    },
  },
};
</script>
