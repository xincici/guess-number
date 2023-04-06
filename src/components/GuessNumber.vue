<template>
  <div class="wrapper" :class="theme">
    <p class="toggle-wrapper">
      <Toggle v-model="audioPlay" trueValue="play" falseValue="pause" onLabel="🔊" offLabel="🔇" class="mr20" />
      <Toggle v-model="theme" trueValue="dark" falseValue="light" onLabel="🌙" offLabel="🌝" class="theme-toggle mr20" />
      <Toggle v-model="language" trueValue="en" falseValue="cn" onLabel="EN" offLabel="中文" />
    </p>
    <h2>
      <span class="title">{{ i18n('gameTitle') }}</span>
      <span class="help" :title="i18n('helpTip')" @click="helpShow = true"><font-awesome-icon icon="fa-solid fa-circle-question" /></span>
    </h2>
    <HelpDialog :help-show="helpShow" @hideHelp="helpShow = false" />
    <audio :src="audio" ref="audioRef" loop="true"></audio>
    <button @click="initGame" class="game-icon">{{ i18n('start') }}</button>
    <div class="game-area">
      <p
        v-for="(oneGuess, idx) in guessHistory"
        :key="idx"
        class="answer-line"
        >
        <span
          v-for="(number, index) in oneGuess"
          :key="index"
          class="number-card"
          >{{ number }}</span>
      </p>
      <p>
        <input
          class="number-input"
          v-model="currentGuess" />
      </p>
      <p>
        <button
          :disabled="enterDisabled"
          @click="guessOnce"
        >Enter</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import sampleSize from 'lodash.samplesize';
import Toggle from '@vueform/toggle';
import '@vueform/toggle/themes/default.css';
import audio from '../assets/yzcw.mp3';
import HelpDialog from './HelpDialog.vue';
import { language } from '../plugins/i18n';
import { theme } from '../utils/theme';


const metaThemeColorEl = document.querySelector('meta[name="theme-color"]');
let lastColor = metaThemeColorEl.getAttribute('content');

const helpShow = ref(false);
watch(helpShow, val => {
  if (val) {
    lastColor = metaThemeColorEl.getAttribute('content');
    metaThemeColorEl.setAttribute('content', 'rgba(0,0,0,0.85)');
  } else {
    metaThemeColorEl.setAttribute('content', lastColor);
  }
});

const audioRef = ref(null);
const audioPlay = ref(false);
onMounted(() => {
  watch(audioPlay, val => {
    if (val === 'play') audioRef.value.play();
    else audioRef.value.pause();
  });
});

const anwser = ref([]);
const gameSize = ref(4);
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
function initGame() {
  anwser.value = sampleSize(numbers, gameSize.value);
  console.log(anwser.value)
}
onMounted(() => {
  initGame();
});

const guessHistory = ref([]);
const currentGuess = ref('');
const enterDisabled = computed(() => {
  if (currentGuess.value.length === gameSize.value) return false;
  return true;
});
function guessOnce() {
  console.log('hhh');
  guessHistory.value.push(currentGuess.value.split('').map(v => +v));
  currentGuess.value = '';
  console.log(guessHistory.value);
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  padding: 40px 0;
  box-sizing: border-box;
  color: #2c3e50;
  &.dark {
    background: #444;
    color: #eee;
  }
  button,button:disabled {
    touch-action: manipulation;
  }
  .mr20 {
    margin-right: 20px;
  }
  .theme-toggle :deep(.toggle-on) {
    background: #222;
    border-color: #222;
  }
  .toggle-wrapper {
    margin: 0 5%;
    text-align: right;
  }
  .title,.help {
    vertical-align: middle;
    display: inline-block;
  }
  .help {
    cursor: pointer;
    font-size: 20px;
    color: #c33;
    margin-left: 10px;
  }
  .game-area {
    .answer-line {
      margin: 5px 0;
      .number-card {
        display: inline-block;
        padding: 10px 15px;
        font-size: 18px;
        font-weight: bold;
        color: #ccc;
        background: rgba(0, 0, 0, 0.5);
        margin: 3px;
      }
    }
  }
}
@media only screen and (min-width: 320px) and (max-width: 720px) {
}
</style>
