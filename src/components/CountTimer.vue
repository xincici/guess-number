<template>
  <span style="margin-left: 20px;">{{ timeStr }}</span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const time = ref(0);
let intervalTimer = null;

const timeStr = computed(() => {
  const sec = time.value;
  return ('00' + ~~(sec / 60)).slice(-2) + ':' + ('00' + sec % 60).slice(-2);
});

function reset() {
  stop();
  time.value = 0;
  start();
}

function stop() {
  if (intervalTimer) clearInterval(intervalTimer);
  intervalTimer = null;
}

function start() {
  intervalTimer = setInterval(() => {
    time.value += 1;
  }, 1000);
}

function onListener(isAdd) {
  document[isAdd ? 'addEventListener' : 'removeEventListener']('visibilitychange', listenerFn);
}

function listenerFn() {
  if (document.hidden) stop();
  else start();
}

onMounted(() => {
  onListener(true);
  start();
});

onUnmounted(() => {
  onListener(false);
});

defineExpose({
  reset,
  stop
});

</script>

<style scoped lang="scss">
</style>
