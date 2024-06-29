<template>
  <div class="navbar">
    <div class="name">
      <img src="/icons/android-chrome-maskable-192x192.png">
      <h1
        v-if="!isMobile"
        class="text-4xl"
      >
        {{ $t("name") }}
      </h1>
    </div>
    <SearchBar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchBar from './SearchBar.vue'

export default defineComponent({
  components: {
    SearchBar,
  },
  data() {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)
    const isMobile = ref(width.value < height.value ? true : false)

    const updateDimensions = () => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }

    window.addEventListener('resize', updateDimensions)

    watchEffect(() => {
      isMobile.value = width.value < height.value
    })

    return {
      width,
      height,
      isMobile,
    }
  },
})
</script>

<style scoped lang="less">
  .navbar {
    display: grid;
    width: 100vw;
    height: 80px;
    border-bottom: 2px solid currentColor;
    align-content: center;
    grid-template: 100% / 3fr 6fr 2fr;
    position: sticky;
    top: 0;
    background-color: var(--background);
    z-index: 1000;

    .name {
      grid-row: 1/2;
      grid-column: 1/2;
      display: flex;
      margin-left: 5px;

      img {
        height: 75px;
      }
    }
    .menu-button {
      place-self: center;
    }
    .search-button > svg,
    .menu-button > svg {
      cursor: pointer;
    }
    .settings_bar {
      display: flex;
      gap: 1em;
      grid-row: 1/2;
      grid-column: 3/4;
      margin-right: 10px;
      align-items: center;
    }
    div.settings-container {
      border-radius: 25px;
      width: 100%;
      position: relative;
      display: grid;
      place-content: center;
      z-index: 10;
    }
  }
</style>
