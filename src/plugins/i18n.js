import { ref, watchEffect } from 'vue';

const en = {
  gameTitle: 'Guess Number',
  availableClicks: 'Available Clicks',
  start: 'New Game',
  helpTip: 'Click for help!',
  helpMsg: 'You have 8 chances to guess a 4-digit number. After each time you input a 4-digit number and submit it, the game will give you a judgment on the correctness of your guess. For example, "1A2B" means that among the numbers you guessed, one number is in the correct position with the correct value, and there are two numbers that have the correct values but are not in the correct positions.',
  help1: 'The digits of the answer will not be repeated.',
  help2: 'Use your smart little brain.',
  confirmText: 'OK, I See',
  tipWin: 'You Win',
  tipLost: 'You Lose'
};
const cn = {
  gameTitle: '猜数字',
  availableClicks: '剩余点击',
  start: '新游戏',
  helpTip: '查看帮助',
  helpMsg: `您有 8 次机会猜中一个 4 位数字，每次您输入一个 4 位数字提交之后，游戏会替您做出判断，给出此次所猜答案的正确度，如 1A2B 表示您猜的数字中，有 1 个数字的位置和数值都正确，另外有 2 个数字数值正确，但不在正确的位置上。`,
  help1: '答案的数字不会重复',
  help2: '动动你聪明的小脑瓜吧',
  confirmText: '好的，明白',
  tipWin: '你赢了',
  tipLost: '你输了'
};
const STORAGE_KEY = '__guess_number__language';

const langs = { en, cn };

export const language = ref(localStorage.getItem(STORAGE_KEY) || 'en');

watchEffect(() => {
  document.title = langs[language.value]['gameTitle'];
  localStorage.setItem(STORAGE_KEY, language.value);
});

export default {
  install: app => {
    app.config.globalProperties.i18n = fullKey => {
      return fullKey.split('.').reduce((obj, key) => {
        if (obj) return obj[key];
      }, langs[language.value]);
    };
  }
}
