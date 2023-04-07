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
    <p>
      <button @click="initGame" class="game-icon">{{ i18n('start') }}</button>
    </p>
    <div class="game-area">
      <p v-show="isDebug">anwser: {{ anwser.join(' ') }}</p>
      <p
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
      </p>
      <p
        v-if="gameResult === GAMING"
        class="answer-line"
      >
        <span
          v-for="n in gameSize"
          :key="n"
          class="number-card"
        >{{ currentGuess[n - 1] || '&nbsp;&nbsp;' }}</span>
        <span class="result-tip">_A_B</span>
      </p>
      <div v-if="gameResult >= WIN" class="win">
        <span>🎉🎉 {{ i18n('tipWin') }} 🎉🎉</span>
      </div>
      <div v-if="gameResult === LOSE" class="lose">👻👻 {{ i18n('tipLost') }} 👻👻</div>
    </div>
    <div class="input-area">
      <button
        v-for="num in numbers"
        :key="num"
        class="number-button"
        :disabled="currentGuess.includes(num) || currentGuess.length >= gameSize"
        @click="addNumber(num)"
        >{{ num }}</button>
      <button
        class="number-button opt-button"
        @click="guessOnce"
        :disabled="currentGuess.length !== gameSize"
      >Enter</button>
      <button
        class="number-button opt-button"
        @click="delNumber"
        :disabled="currentGuess.length === 0"
      >Delete</button>
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

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const [GAMING, LOSE, WIN] = [0, 1, 2];

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

const isDebug = ref(location.search.includes('debug'));
const anwser = ref([]);
const gameSize = ref(4);
const maxGuess = computed(() => gameSize.value << 1);
const gameResult = ref(GAMING);

const guessHistory = ref([]);
const currentGuess = ref('');

onMounted(() => {
  watch(audioPlay, val => {
    if (val === 'play') audioRef.value.play();
    else audioRef.value.pause();
  });
});

function initGame() {
  anwser.value = sampleSize(numbers, gameSize.value);
  gameResult.value = GAMING;
  guessHistory.value.length = 0;
}
onMounted(() => {
  initGame();
});

function addNumber(num) {
  currentGuess.value += num;
}
function delNumber() {
  currentGuess.value = currentGuess.value.slice(0, -1);
}

function guessOnce() {
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
  padding: 40px 0;
  box-sizing: border-box;
  color: #2c3e50;
  &.dark {
    background: #444;
    color: #eee;
    .game-area {
      .win,.lose {
        background-color: #333;
      }
    }
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
  .game-icon {
    cursor: pointer;
    width: 125px;
    padding: 10px 20px;
    color: #fff;
    font-weight: bold;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    border: 0 none;
  }
  .game-area {
    display: inline-block;
    position: relative;
    padding: 10px;
    margin-bottom: 160px;
    .answer-line {
      margin: 5px 0;
      .number-card, .result-tip {
        display: inline-block;
        padding: 8px 18px;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        margin: 1px 3px;
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
    max-width: 360px;
    box-sizing: border-box;
    padding: 10px;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: rgba(200, 200, 200, 1);
    .number-button {
      flex: 0 0 22%;
      flex-shrink: 0;
      height: 36px;
      line-height: 36px;
      margin: 3px;
      font-size: 16px;
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
@media only screen and (min-width: 320px) and (max-width: 720px) {
  .wrapper {
    .input-area {
      width: 100%;
      max-width: inherit;
    }
  }
}
</style>
