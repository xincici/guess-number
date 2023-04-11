<template>
  <span style="margin-left: 20px;">{{ timeStr }}</span>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const time = ref(0);
const begin = ref(0);
let intervalTimer = null;

const timeStr = computed(() => {
  const sec = Math.round((time.value - begin.value) / 1000);
  return ('00' + ~~(sec / 60)).slice(-2) + ':' + ('00' + sec % 60).slice(-2);
});

function start() {
  time.value = begin.value = Date.now();
  stop();
  intervalTimer = setInterval(() => {
    time.value = Date.now();
  }, 1000);
}

function stop() {
  if (intervalTimer) clearInterval(intervalTimer);
}

onMounted(() => {
  start();
});

defineExpose({
  start,
  stop
});

</script>

<style scoped lang="scss">
</style>
