<template>
  <div>
    <Teleport to="body">
      <div
        v-if="showWelcome"
        id="welcomeScreen"
        class="window"
      >
        <button
          type="button"
          class="close"
          @click="showWelcome = false"
        >
          X
        </button>
        <WelcomeScreen />
      </div>
    </Teleport>
    <NavBar />
    <MainPage />
  </div>
  <!-- <PWABadge /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import WelcomeScreen from './WelcomeContainer.vue'
import NavBar from './navbar/NavBar.vue'
import MainPage from './main/MainContainer.vue'
import { checkConnection } from './connection/connection'
import { SetUserSettings } from './userSettings/userSettings'
// import PWABadge from './PWABadge.vue'

export default defineComponent({
  components: {
    WelcomeScreen,
    NavBar,
    MainPage,
    // PWABadge,
  },
  setup() {
    const { locale } = useI18n()
    const showWelcome = ref(!localStorage.getItem('library-2.0-welcome'))
    onMounted(() => {
      checkConnection()
      SetUserSettings()
      locale.value = window.user_settings.language
    })
    return {
      showWelcome,
    }
  },
})
</script>

<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    display: grid;
    grid-template: 1fr 9fr / 100%;
  }
</style>
