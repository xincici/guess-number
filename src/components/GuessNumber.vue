<template>
  <div class="wrapper" :class="theme">
    <TopHeader />
    <div class="opt-area">
      <button @click="initGame" class="game-icon">{{ i18n('start') }}</button>
      <CountTimer ref="timerRef" :enable="gameResult === GAMING" />
    </div>
    <div class="game-area">
      <p v-show="isDebug">anwser: {{ anwser.join(' ') }}</p>
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
          v-for="n in gameSize"
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
        {{ i18n('anwserIs') + anwser.join('') }}
      </div>
    </div>
    <div class="input-area">
      <button
        v-for="num in numbers"
        :key="num"
        class="number-button"
        :disabled="currentGuess.includes(num) || currentGuess.length >= gameSize || gameResult !== GAMING"
        @click="addNumber(num)"
        >{{ num }}</button>
      <button
        class="number-button opt-button"
        @click="guessOnce"
        :disabled="currentGuess.length !== gameSize || gameResult !== GAMING"
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
import { ref, watch, computed, onMounted } from 'vue';
import JSConfetti from 'js-confetti';
import sampleSize from 'lodash.samplesize';

import TopHeader from './TopHeader.vue';
import CountTimer from './CountTimer.vue';
import { theme } from '../utils/theme';

const jsConfetti = new JSConfetti();

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const [GAMING, LOSE, WIN] = [0, 1, 2];

const timerRef = ref(null);

const isDebug = ref(location.search.includes('debug'));
const anwser = ref([]);
const gameSize = ref(4);
const maxGuess = computed(() => gameSize.value << 1);
const gameResult = ref(GAMING);

watch(gameResult, val => {
  if (val !== GAMING) timerRef.value.stop();
  if (val === WIN) jsConfetti.addConfetti();
});

const guessHistory = ref([]);
const currentGuess = ref('');

onMounted(() => {
  initGame();
  addListener();
});

function initGame() {
  anwser.value = sampleSize(numbers, gameSize.value);
  guessHistory.value.length = 0;
  currentGuess.value = '';
  gameResult.value = GAMING;
  timerRef.value.reset();
}
function addListener() {
  document.body.addEventListener('keyup', e => {
    const num = e.key;
    if (num === 'Enter') return guessOnce();
    if (num === 'Backspace') return delNumber();
    if (numbers.includes(+num)) return addNumber(+num);
  });
}
function addNumber(num) {
  if (currentGuess.value.includes(num)) return;
  currentGuess.value += num;
}
function delNumber() {
  if (currentGuess.value.length === 0) return;
  currentGuess.value = currentGuess.value.slice(0, -1);
}
function guessOnce() {
  if (currentGuess.value.length !== gameSize.value) return;
  let [A, B] = [0, 0];
  for (let i = 0; i < gameSize.value; i++) {
    let one = +currentGuess.value[i];
    const idx = anwser.value.indexOf(one);
    if (idx === i) A++;
    else if (idx >= 0) B++;
  }
  guessHistory.value.push({
    nums: currentGuess.value.split('').map(v => +v),
    res: `${A}A${B}B`
  });
  if (A === gameSize.value) {
    gameResult.value = WIN;
    currentGuess.value = '';
    return;
  }
  if (guessHistory.value.length >= maxGuess.value) {
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
  color: #2c3e50;
  &.dark {
    background: #444;
    color: #eee;
    .header-wrapper {
      border-bottom: 1px solid #333;
    }
    .game-area {
      .win,.lose {
        background-color: #333;
      }
    }
  }
  .header-wrapper {
    border-bottom: 1px solid #eee;
  }
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
  }
  .opt-area {
    margin: 40px 0 10px;
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
        background: rgba(0, 0, 0, 0.5);
        margin: 1px 3px;
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
        background: rgba(0, 0, 0, 0.7);
      }
    }
    .win,.lose {
      background-color: #f1f1f1;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      opacity: 0.95;
      font-weight: bold;
      color: #11aa11;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .lose {
      color: #aa1111;
    }
  }
  .input-area {
    width: 600px;
    box-sizing: border-box;
    padding: 10px 10px 22px;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: rgba(200, 200, 200, 1);
    .number-button {
      flex: 0 0 23%;
      height: 44px;
      margin: 3px;
      font-size: 18px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border: 0 none;
      cursor: pointer;
      &:disabled {
        background: rgba(0, 0, 0, 0.3);
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
