<template>
  <div class="search_container">
    <div
      v-if="isMobile && !showSearchBar"
      class="search-button"
      @click="showSearchBar = !showSearchBar"
    >
      {{ console.log(isMobile, !showSearchBar) }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="30"
        height="30"
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <path
          d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
        />
      </svg>
    </div>
    <input
      v-if="!isMobile"
      v-model="text"
      type="search"
      :placeholder="$t('search_book')"
      @input="setSearch(text)"
    />
    <Transition>
      <div v-if="isMobile && showSearchBar" class="search__bar">
        <input type="search" :placeholder="$t('search_book')" />
        <button class="close" @click="showSearchBar = false">X</button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue'

  export default defineComponent({
    setup() {
      const { searchText } = useGlobalState()
      const text =
        searchText.value === 'all_favorite__book'
          ? ''
          : searchText.value === ' '
          ? ''
          : searchText.value

      const setSearch = (text: string) => {
        // * Implement set search text logic here. For simplicity, just updating the state.
        searchText.value = text
      }
      return {
        text,
        setSearch,
      }
    },
    data() {
      const width = ref(window.innerWidth)
      const height = ref(window.innerHeight)
      const isMobile = ref(width.value < height.value ? true : false)
      const showSearchBar = ref(false)

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
        showSearchBar,
      }
    },
  })
</script>

<style lang="less">
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
  .search_container {
    display: grid;
    grid-column: 2/3;
    grid-row: 1/2;
    input {
      place-self: center;
    }
  }
  .search-button {
    cursor: pointer;
    place-self: center;
  }
  .search__bar {
    background-color: var(--background);
    display: grid;
    place-items: center;

    .close {
      position: relative;
      grid-column: 2/3;
    }
  }
  input[type='search'] {
    box-shadow: 0 0 30px 5px currentColor;
  }
  input::placeholder {
    color: currentColor;
    opacity: 1;
  }
</style>
