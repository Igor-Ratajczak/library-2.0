<template>
  <div class="welcome-page">
    <h1 class="headline text-4xl">
      {{ $t('hello') }}
    </h1>
    <p>
      {{ $t('welcome_page_text_0') }}
    </p>
    <div class="add_book">
      <p>
        {{ $t('add_book') }}
      </p>
      <AddBookButton />
    </div>
    <p class="settings">
      {{ $t('welcome_page_text_1') }}
      <SettingsButton />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Notification } from './notification/notification'
import AddBookButton from './main/AddBookButton.vue'
import SettingsButton from './main/SettingsButton.vue'

useSeoMeta({
  title: 'Witaj w Library 2.0',
})
export default defineComponent({
  components: {
    AddBookButton,
    SettingsButton,
  },
  data() {
    return {
      setting: false,
    }
  },
  mounted() {
    localStorage.setItem('library-2.0-welcome', 'false')
  },
  methods: {
    Notification,
  },
})
</script>

<style scoped lang="less">
.welcome-page {
    display: grid;
    gap: 3em;
    padding-top: 2em;

    div.add_book{
      display: flex;
      gap: 1em;
      justify-content: center;
    }
    .settings {
      display: grid;
      justify-items: center;
      gap: 1em;
    }
  }
</style>
