<template>
  <div class="header-wrapper">
    <span class="item-wrapper">
      <HelpDialog />
    </span>
    <span class="item-wrapper" @click="toggleRobot">
      <i i-mdi-robot-outline v-if="robot" />
      <i i-mdi-robot-off-outline v-else />
    </span>
    <span class="title">{{ i18n('gameTitle') }}</span>
    <span class="item-wrapper" @click="toggleTheme">
      <i i-carbon-moon v-if="isDark" />
      <i i-carbon-sun v-else />
    </span>
    <span class="item-wrapper" @click="toggleLanguage">
      <i i-carbon-ibm-watson-language-translator />
    </span>
  </div>
</template>

<script setup>
import HelpDialog from './HelpDialog.vue';

import { toggle as toggleLanguage } from '../plugins/i18n';
import { isDark, toggle as toggleTheme } from '../utils/theme';
import { robot, toggle as toggleRobot } from '../utils/robot';

</script>

<style scoped lang="scss">
.header-wrapper {
  background: var(--bg-color);
  max-width: 480px;
  padding: 10px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--border-color);
  z-index: 1;
  .title {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .item-wrapper {
    flex-grow: 0;
    cursor: pointer;
    margin: 0 8px;
    font-size: 20px;
  }
}
</style>
