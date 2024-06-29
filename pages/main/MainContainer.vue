<template>
  <main>
    <div class="filter_container">
      <div class="sort_book_container">
        <select
          id="sort_book"
          v-model="currentSort"
          name="sort_book"
          @change="updateSort(currentSort)"
        >
          <option value="title">
            {{ $t('sort_name') }}
          </option>
          <option value="author">
            {{ $t('sort_author') }}
          </option>
          <option value="newest">
            {{ $t('sort_new') }}
          </option>
          <option value="older">
            {{ $t('sort_old') }}
          </option>
        </select>
        <label for="sort_book">Sortowanie</label>
      </div>
      <div
        class="favorite"
        @click="SearchFavoriteBook"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 300 300"
        >
          <path
            :class="favorite === 'favorite' ? 'active' : null"
            fill="currentcolor"
            d="M0 200 v-200 h200
              a100,100 90 0,1 0,200
              a100,100 90 0,1 -200,0
              z"
          />
        </svg>
      </div>
    </div>
    <div class="menu_container">
      <AddBook @load-books="updateAddingBook" />
      <div class="settings-container">
        <SettingsButton />
      </div>
      <ChangeLang />
    </div>
    <BooksContainer ref="booksContainer" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddBook from './AddBookButton.vue'
import SettingsButton from './SettingsButton.vue'
import ChangeLang from './ChangeLang.vue'
import BooksContainer from './BooksContainer.vue'
import { useGlobalState } from '~/composables/state'

export default defineComponent({
  components: {
    AddBook,
    SettingsButton,
    ChangeLang,
    BooksContainer,
  },
  setup() {
    const { currentPage, currentSort, addingBook, favorite } = useGlobalState()

    const updateSort = (newSort: string) => {
      // * Implement sorting logic here. For simplicity, just updating the state.
      currentSort.value = newSort
    }
    const updateAddingBook = () => {
      // * Implement adding new book logic here. For simplicity, just updating the state.
      addingBook.value = true
    }
    const SearchFavoriteBook = () => {
      // * Implement searching favorite book logic here. For simplicity, just updating the state.
      favorite.value === 'favorite'
        ? (favorite.value = '')
        : (favorite.value = 'favorite')
    }

    return {
      currentPage,
      currentSort,
      updateSort,
      updateAddingBook,
      SearchFavoriteBook,
      favorite,
    }
  },
})
</script>

<style lang="less">
  main {
    display: grid;
    grid-template: 4em 100% / 50% 50%;
    min-height: calc(100vh - 80px);

    .filter_container {
      border-right: var(--border-2px-current);
      grid-column: 1;
    }
    .menu_container {
      border-left: var(--border-2px-current);
      grid-column: 2;
    }
    .filter_container,
    .menu_container {
      display: flex;
      padding: 10px;
      gap: 10%;
      place-content: center;
      height: 100%;
      border-bottom: var(--border-2px-current);
      place-items: center;
      .sort_book_container,
      .type_book_container {
        position: relative;
        height: 50px;
        display: grid;

        select {
          width: 100%;
          border-radius: 25px;
          padding: 15px 15px 10px 15px;
          border: var(--border-2px-current);
        }

        label {
          position: relative;
          font-size: 13px;
          background: none;
          bottom: 48px;
          place-self: center;
        }
      }

      .favorite {
        display: grid;
        place-items: center;
        height: 40px;
        cursor: pointer;

        svg {
          transform: rotateZ(-135deg);

          .active {
            fill: red;
          }
        }
      }
    }
    .pages {
      display: flex;
      gap: 1em;
      position: fixed;
      bottom: 0;
      z-index: 10;

      div.button_pages {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        border: var(--border-2px-current);
        background-color: var(--background);
        cursor: pointer;
        align-content: center;
        text-align: center;
        color: var(--color);

        &.active {
          border-color: red;
        }
      }
    }
  }
</style>
