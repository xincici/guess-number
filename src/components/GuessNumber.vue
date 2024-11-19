<template>
  <div class="wrapper">
    <TopHeader />
    <div class="opt-area">
      <button ref="initRef" @click="initGame" class="game-icon">{{ i18n('start') }}</button>
      <CountTimer ref="timerRef" :enable="gameResult === GAMING" />
    </div>
    <div class="game-area">
      <p v-show="isDebug">anwser: {{ anwser }}</p>
      <div
        v-for="(oneGuess, idx) in guessHistory"
        :key="idx"
        class="answer-line"
        >
        <span
          v-for="(number, index) in oneGuess.nums"
          :key="index"
          class="number-card"
          >{{ number }}</span>
        <span class="result-tip">{{ oneGuess.res }}</span>
      </div>
      <div
        v-if="gameResult === GAMING"
        class="answer-line"
      >
        <span
          v-for="n in GAME_SIZE"
          :key="n"
          class="number-card"
          :class="n - 1 === currentGuess.length ? 'current-input' : ''"
        >{{ currentGuess[n - 1] || '&nbsp;&nbsp;' }}</span>
        <span class="result-tip">_A_B</span>
      </div>
      <div v-if="gameResult >= WIN" class="win">
        <span>🎉🎉 {{ i18n('tipWin') }} 🎉🎉</span>
      </div>
      <div v-if="gameResult === LOSE" class="lose">
        👻👻 {{ i18n('tipLost') }} 👻👻
        <br />
        {{ i18n('anwserIs') + anwser }}
      </div>
    </div>
    <div class="input-area" :class="{ hide: gameResult !== GAMING }">
      <button
        v-for="num in NUMBERS"
        :key="num"
        class="number-button"
        :disabled="currentGuess.includes(num) || currentGuess.length >= GAME_SIZE || gameResult !== GAMING"
        @click="addNumber(num)"
        >{{ num }}</button>
      <button
        class="number-button opt-button"
        @click="guessOnce"
        :disabled="currentGuess.length !== GAME_SIZE || gameResult !== GAMING"
      >{{ i18n('optEnter') }}</button>
      <button
        class="number-button opt-button"
        @click="delNumber"
        :disabled="currentGuess.length === 0 || gameResult !== GAMING"
      >{{ i18n('optDel') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import sampleSize from 'lodash.samplesize';

import TopHeader from './TopHeader.vue';
import CountTimer from './CountTimer.vue';
import { robot } from '../utils/robot.js';
import confetti from '../utils/confetti.js';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const [GAMING, LOSE, WIN] = [0, 1, 2];
const GAME_SIZE = 4; // it is always a 4 digits number
const MAX_GUESS = 8; // the maximun number of guess

const timerRef = ref(null);
const initRef = ref(null);

const isDebug = ref(location.search.includes('debug'));
const anwser = ref('');
const gameResult = ref(GAMING);

const guessHistory = ref([]);
const currentGuess = ref('');

let firstGuessTimer = null;
const firstGuessDuration = 200;

watch(gameResult, val => {
  if (val !== GAMING) timerRef.value.stop();
  if (val === WIN) confetti();
});

onMounted(() => {
  initGame();
  addListener();
});

function initGame() {
  if (firstGuessTimer) {
    clearTimeout(firstGuessTimer);
    firstGuessTimer = null;
  }
  anwser.value = sampleSize(NUMBERS, GAME_SIZE).join('');
  guessHistory.value.length = 0;
  currentGuess.value = '';
  gameResult.value = GAMING;
  timerRef.value.reset();
  initRef.value.blur();
  if (robot.value) initWithFirstGuess(1);
}
function initWithFirstGuess(num) {
  firstGuessTimer = setTimeout(() => {
    currentGuess.value += String(num);
    if (currentGuess.value.length === GAME_SIZE) {
      firstGuessTimer = null;
      guessOnce();
      return;
    }
    initWithFirstGuess(num + 1);
  }, firstGuessDuration);
}
function addListener() {
  window.addEventListener('keyup', e => {
    const num = e.key;
    if (num === 'Enter') return guessOnce();
    if (num === 'Backspace') return delNumber();
    if (NUMBERS.includes(+num)) return addNumber(+num);
  });
}
function addNumber(num) {
  if (firstGuessTimer) return;
  if (currentGuess.value.includes(num)) return;
  currentGuess.value += num;
}
function delNumber() {
  if (firstGuessTimer) return;
  if (currentGuess.value.length === 0) return;
  currentGuess.value = currentGuess.value.slice(0, -1);
}
function guessOnce() {
  if (currentGuess.value.length !== GAME_SIZE) return;
  let [A, B] = [0, 0];
  for (let i = 0; i < GAME_SIZE; i++) {
    let one = currentGuess.value[i];
    const idx = anwser.value.indexOf(one);
    if (idx === i) A++;
    else if (idx >= 0) B++;
  }
  guessHistory.value.push({
    nums: currentGuess.value.split('').map(v => +v),
    res: `${A}A${B}B`
  });
  if (A === GAME_SIZE) {
    gameResult.value = WIN;
    currentGuess.value = '';
    return;
  }
  if (guessHistory.value.length >= MAX_GUESS) {
    gameResult.value = LOSE;
  }
  currentGuess.value = '';
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  box-sizing: border-box;
  background: var(--bg-color);
  color: var(--text-color);
  button,button:disabled {
    touch-action: manipulation;
  }
  .game-icon {
    cursor: pointer;
    width: 125px;
    height: 36px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    background: rgba(60, 160, 60, 0.9);
    border: 0 none;
    border-radius: 6px;
  }
  .opt-area {
    padding: 90px 0 10px;
  }
  .game-area {
    display: inline-block;
    position: relative;
    padding: 10px;
    margin-bottom: 185px;
    .answer-line {
      margin: 5px 0;
      .number-card, .result-tip {
        position: relative;
        display: inline-block;
        padding: 8px 18px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
        margin: 1px 3px;
        border-radius: 4px;
        &.current-input:after {
          content: " ";
          position: absolute;
          background: rgba(200, 200, 200, 0.5);
          width: 40%;
          height: 2px;
          left: 30%;
          bottom: 20%;
        }
      }
      .result-tip {
        width: 80px;
        padding: 0;
        vertical-align: bottom;
        background: rgba(0, 0, 0, 0.75);
      }
    }
    .win,.lose {
      background: var(--mask-color);
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      font-weight: bold;
      color: #1b1;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .lose {
      color: #b11;
    }
  }
  .input-area {
    width: 600px;
    height: auto;
    box-sizing: border-box;
    padding: 10px 10px 22px;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    transition: bottom 0.5s ease-in-out;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: var(--bg-color);
    &.hide {
      bottom: -100%;
    }
    .number-button {
      flex: 0 0 23%;
      height: 46px;
      margin: 3px;
      font-size: 18px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      border: 0 none;
      border-radius: 6px;
      cursor: pointer;
      &:disabled {
        background: rgba(30, 30, 30, 0.5);
        color: #ccc;
      }
      &.opt-button {
        flex-grow: 1;
      }
    }
  }
}
@media only screen and (max-width: 720px) {
  .wrapper {
    .input-area {
      width: 100%;
      max-width: inherit;
    }
  }
}
</style>
