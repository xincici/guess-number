<template>
  <GuessNumber />
</template>

<script setup>
import GuessNumber from './components/GuessNumber.vue';
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  --border-color: #eee;
  --text-color: #2c3e50;
  --bg-color: #fff;
  &.dark {
    --border-color: #444;
    --text-color: #eee;
    --bg-color: #333;
  }
}
</style>
