<template>
  <div
    v-if="books.length !== 0"
    class="books_container"
  >
    <div
      v-for="item in books"
      :key="item.book_id"
      class="book"
    >
      <h2>{{ item.title }}</h2>
      <h3>{{ item.author }}</h3>
      <div class="option_book">
        <div
          class="favorite"
          :class="item.favorite === true ? 'active' : null"
          @click="setFavoriteBook(item)"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 300 300"
          >
            <path
              fill="currentcolor"
              d="M0 200 v-200 h200
                a100,100 90 0,1 0,200
                a100,100 90 0,1 -200,0
                z"
            />
          </svg>
        </div>
        <div
          class="remove"
          @click="removeBook(item)"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 60 70"
          >
            <rect
              x="10"
              y="10"
              rx="5"
              ry="5"
              width="40"
              height="50"
              fill="currentcolor"
            />
            <rect
              x="5"
              y="0"
              rx="10"
              ry="10"
              width="50"
              height="10"
              fill="currentcolor"
            />
            <line
              x1="20"
              x2="20"
              y1="15"
              y2="55"
              stroke="black"
              stroke-width="3"
            />
            <line
              x1="30"
              x2="30"
              y1="15"
              y2="55"
              stroke="black"
              stroke-width="3"
            />
            <line
              x1="40"
              x2="40"
              y1="15"
              y2="55"
              stroke="black"
              stroke-width="3"
            />
          </svg>
        </div>
        <div
          class="edit"
          @click=";(isEditing = true), edit_book.push(item)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="40"
            height="40"
            viewBox="0 0 50 50"
          >
            <path
              d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <button
          type="button"
          @click="show = !show"
        >
          {{ $t('show_more') }}
        </button>
      </div>
      <img
        :src="item.image as string === '' ? '/icons/no-image.png' :item.image as string"
        :style="{ width: item.image as string === '' ? 'fit-content' :null, height: item.image as string === '' ? 'fit-content' :null }"
        alt="book"
      >
      <Transition>
        <div
          v-if="show"
          class="more_data"
        >
          <div class="published">
            <b>{{ item.publisher }}</b>
            <p>{{ item.publishedDate }}</p>
          </div>
          <div class="description">
            {{ item.description }}
          </div>
        </div>
      </Transition>
    </div>
    <Teleport to="body">
      <EditBookContainer
        v-if="isEditing"
        :data="edit_book[0]"
        @close=";(isEditing = false), (edit_book = [])"
        @save="handleSave"
      />
    </Teleport>
    <Teleport to="main">
      <div class="pages">
        <div
          v-for="n in buttonPages"
          :key="n"
          class="button_pages"
          :class="n === currentPage ? 'active' : null"
          @click="n === '...' ? null : (currentPage = n as number)"
        >
          {{ n }}
        </div>
      </div>
    </Teleport>
  </div>
  <div
    v-else
    class="no_book"
  >
    {{ $t('no_book') }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LibraryDatabase, type Book } from '../book/IDB/IDB'
import { Notification, notificationData } from '../notification/notification'
import EditBookContainer from './EditBookContainer.vue'
import { page_sort } from './page_sort'
import { useGlobalState } from '~/composables/state'

export default defineComponent({
  name: 'BooksContainer',
  components: {
    EditBookContainer,
  },
  setup() {
    let isEditing = false
    const edit_book: Ref<Book[]> = ref([])
    const books: Ref<Book[]> = ref([])
    const buttonPages: Ref<Array<number | string>> = ref([])
    const { currentPage, currentSort, addingBook, searchText, favorite }
        = useGlobalState()
    const { NumberPages, SortBooks, updateURL, searchBook } = new page_sort()

    const loadBooks = async (n: number) => {
      const libraryDB = new LibraryDatabase()
      try {
        // * Load the all books from the library database
        const allBooks: Book[] = await libraryDB.getAllBooks()
        // ! filter book on the current site
        const startIndex = (n - 1) * 10 // * start of book index
        const endIndex = n * 10 // * end of book index
        let data: Book[]
        let newListBooks: Book[]
        if (favorite.value === 'favorite') {
          data = allBooks.filter((book: Book) => book.favorite)
          if (searchText.value === '') {
            newListBooks = data
          }
          else {
            newListBooks = searchBook(data, searchText.value)
            currentPage.value = n
          }
        }
        else {
          data = allBooks
          if (searchText.value === '') {
            newListBooks = data
          }
          else {
            newListBooks = searchBook(data, searchText.value)
            currentPage.value = n
          }
        }

        // ! Calculate the total number of pages
        buttonPages.value = NumberPages(newListBooks, n).value
        // * Sort the books array based on the current sort option
        const sortingBooks = SortBooks(
          newListBooks,
          String(currentSort.value),
        )
        // * Update the URL with the current page and sort option
        if (currentPage.value > Number(buttonPages.value)) {
          updateURL(
            String(1),
            currentSort.value,
            searchText.value,
            favorite.value,
          )
          currentPage.value = 1
        }
        else
          updateURL(
            String(currentPage.value),
            currentSort.value,
            searchText.value,
            favorite.value,
          )
          // * Populate the books array
        books.value = sortingBooks.slice(startIndex, endIndex)
      }
      catch (error) {
        Notification(
          'error',
          notificationData[window.user_settings.language].error.load_book,
        )
      }
    }
    const setFavoriteBook = async (book: Book) => {
      const libraryDB = new LibraryDatabase()
      try {
        await libraryDB.favoriteBook(book)
        loadBooks(currentPage.value)
      }
      catch (error) {
        Notification(
          'error',
          notificationData[window.user_settings.language].error.edit_book,
        )
      }
    }

    const removeBook = async (book: Book) => {
      const libraryDB = new LibraryDatabase()
      try {
        await libraryDB.removeBook(book)
        loadBooks(currentPage.value)
      }
      catch (error) {
        Notification(
          'error',
          notificationData[window.user_settings.language].error.remove_book,
        )
      }
    }
    const editBook = async (book: Book) => {
      const libraryDB = new LibraryDatabase()
      try {
        await libraryDB.editBook(book)
        loadBooks(currentPage.value)
      }
      catch (error) {
        Notification(
          'error',
          notificationData[window.user_settings.language].error.edit_book,
        )
      }
    }
    const search = (allBooks: Book[], type: string) => {
      // * Search for book in the library database
      books.value = searchBook(allBooks, type)
    }

    // ! save data of book to database after editing
    const handleSave = (payload: { data: Book }) => {
      // * clear the edit_book value
      edit_book.value = []
      // * change isEditing to false
      isEditing = false
      // * update the book data in the library database
      editBook(payload.data)
    }

    // ! watch for set current sort option
    watch(currentSort, (newVal) => {
      if (newVal) {
        loadBooks(currentPage.value)
      }
    })

    // ! watch for set current page number
    watch(currentPage, (newVal) => {
      if (newVal) {
        loadBooks(newVal)
      }
    })

    // ! watch for run loadBooks function after adding book
    watch(addingBook, (newVal) => {
      if (newVal === true) {
        loadBooks(currentPage.value)
      }
    })

    // ! watch for run loadBooks function after input text to search
    watch(searchText, () => {
      loadBooks(1)
    })

    // ! watch for run loadBooks function after toggle favorite
    watch(favorite, () => {
      loadBooks(1)
    })
    onMounted(() => {
      loadBooks(currentPage.value)
    })

    return {
      isEditing,
      edit_book,
      books,
      buttonPages,
      currentPage,
      currentSort,
      setFavoriteBook,
      removeBook,
      editBook,
      handleSave,
      loadBooks,
      search,
      show: ref(false),
    }
  },
})
</script>

<style lang="less">
  .books_container {
    display: grid;
    position: relative;
    grid-column: 1/3;
    justify-content: center;
    grid-template-columns: 100%;
    justify-items: center;

    .book {
      display: grid;
      grid-template: 2fr 2fr 2fr 2fr / 50% 50%;
      width: 30%;
      height: 27em;
      justify-items: center;
      margin-top: 10em;
      position: relative;

      @media screen and (max-width: 900px) {
        width: 80%;
      }

      h2 {
        grid-column: 2;
        grid-row: 1;
      }

      h3 {
        grid-column: 2;
        grid-row: 2;
      }

      .option_book {
        display: flex;
        flex-direction: column;
        grid-column: 2;
        grid-row: 3;
        gap: 2em;
        justify-content: center;

        .favorite,
        .remove,
        .edit {
          cursor: pointer;
        }

        .favorite {
          display: grid;
          place-items: center;
          height: 40px;

          svg {
            transform: rotateZ(-135deg);
          }

          &.active {
            svg > path {
              fill: red;
            }
          }
        }
      }

      img {
        width: 100%;
        height: 100%;
        grid-column: 1;
        grid-row: 1 / 5;
        align-self: center;
      }
      .more_data {
        grid-column: 1;
        grid-row: 1 / 5;
        width:50%;
        height: 100%;
        left: 0;
        background: #00000099;
        position: absolute;
        grid-template-rows: 2fr 5fr;
        display: grid;

        .published {
          text-align: center;
        }

        .description {
          overflow: auto;
          height: 100%;
          padding: 2em;
        }
      }
    }
  }

  .no_book {
    grid-column: 1/3;
    place-self: center;
  }
</style>
