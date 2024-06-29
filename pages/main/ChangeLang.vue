<template>
  <div class="language-container">
    <div
      v-for="lang in ['pl', 'en']"
      :key="lang"
      class="languageButton"
      :class="{ active: lang === language }"
      @click="toggleLanguage(lang)"
      @change="toggleLanguage(lang)"
    >
      {{ lang.toUpperCase() }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      language: window.user_settings.language,
    }
  },
  mounted() {
    const savedLang = window.user_settings.language
    if (savedLang) {
      this.language = savedLang
      this.$i18n.locale = savedLang
    }
  },
  methods: {
    toggleLanguage(lang: string) {
      this.language = lang
      localStorage.setItem('lang', lang)
      this.$i18n.locale = lang
    },
  },
})
</script>

<style scoped lang="less">
  div.language-container {
    cursor: pointer;
    display: flex;
    gap: 20px;
    transition: background 0.5s ease;
    .languageButton {
      background: rgb(255, 255, 255);
      border-radius: 25px;
      height: 40px;
      width: 40px;
      transition: 0.2s transform ease-in-out;
      text-align: center;
      align-content: center;
      color: black;
      user-select: none;
    }
    .active {
      box-shadow: 0 0 20px 5px rgb(246, 255, 0);
    }
  }
</style>
