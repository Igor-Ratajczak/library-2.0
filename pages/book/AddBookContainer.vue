<template>
  <div
    id="add_book_container"
    class="window"
  >
    <button
      type="button"
      class="close"
      @click="$emit('close')"
    >
      X
    </button>
    <div id="search_bookAPI">
      <input
        v-model="text"
        type="search"
        :placeholder="$t('search_book')"
        @input="fetchData"
      >
    </div>
    <div id="list_book">
      <div
        v-for="item in books"
        :key="item.id"
        :class="{ test: isInDB(item.id) }"
        class="book"
        @click.once="($event: Event) => setClass($event, item)"
      >
        <div class="title">
          <b class="text-1sxl">{{ item.volumeInfo.title }}</b>
          <p
            v-if="item.volumeInfo.subtitle"
            class="text-1xl"
          >
            {{ item.volumeInfo.subtitle }}
          </p>
        </div>
        <div
          class="authors"
        >
          <h3
            v-for="author in item.volumeInfo.authors"
            :key="author"
          >
            {{ author }}
          </h3>
        </div>
        <div class="description">
          <p>{{ item.volumeInfo.description }}</p>
        </div>
        <div class="image">
          <img
            :src="item.volumeInfo.imageLinks?.smallThumbnail"
            alt="book"
          >
        </div>
      </div>
    </div>
    <div class="add_book_button">
      <button
        v-if="selectBooks.length > 0"
        type="button"
        @click="addBook(selectBooks)"
      >
        {{ $t('add_book') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick } from 'vue'
import { Notification, notificationData } from '../notification/notification'
import { LibraryDatabase, type Book } from './IDB/IDB'

interface BookItem {
  id: string
  volumeInfo: {
    title: string
    subtitle: string
    authors: Array<string>
    publisher: string
    publishedDate: string
    description: string
    imageLinks: {
      smallThumbnail: string
      thumbnail: string
    }
  }
}

export default defineComponent({
  emits: ['close', 'load-books'],
  setup() {
    const books = ref<BookItem[]>([])
    const text = ref('')
    const selectBooks: Ref<Book[]> = ref([])
    const bookStatus = reactive<{ [key: string]: boolean }>({})
    let timeoutId: ReturnType<typeof setTimeout>

    const fetchData = async () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${text.value}&maxResults=25&projection=full`,
          )
          const data = await response.json()
          books.value = data.items || []
          await nextTick()
          updateBookStatus()
        }
        catch (error) {
          console.error('Error fetching data:', error)
        }
      }, 500)
    }

    const updateBookStatus = async () => {
      books.value.forEach(async (item) => {
        const libraryDB = new LibraryDatabase()
        const filterBooks = await libraryDB.filterIDB('book_id', item.id)
        bookStatus[item.id] = filterBooks.length > 0
      })
    }

    const isInDB = (id: string) => {
      return bookStatus[id] || false
    }

    const setClass = (event: Event, item: BookItem) => {
      const target = event.currentTarget as HTMLElement

      if (target) {
        if (!target.classList.contains('test')) {
          const book: Book = {
            book_id: item.id || '',
            title: item.volumeInfo.title || '',
            author: item.volumeInfo.authors[0] || '',
            publisher: item.volumeInfo.publisher || '',
            publishedDate: item.volumeInfo.publishedDate || '',
            description: item.volumeInfo.description || '',
            image: item.volumeInfo.imageLinks?.thumbnail || '',
            favorite: false,
          }

          selectBooks.value.push(book)
          target.classList.add('animation')
        }
      }
    }

    return {
      text,
      fetchData,
      books,
      isInDB,
      setClass,
      selectBooks,
    }
  },
  methods: {
    addBook(selectBooks: Book[]) {
      const libraryDB = new LibraryDatabase()
      try {
        libraryDB.addBooks(selectBooks)
        selectBooks = []
        this.$emit('close')
        this.$emit('load-books')
      }
      catch (error) {
        Notification(
          'error',
          notificationData[window.user_settings.language].error.add_book,
        )
      }
    },
  },
})
</script>

<style scoped lang="less">
  div#add_book_container {
    z-index: 10001;
    display: grid;
    grid-template: 2fr 15fr 2fr / 100%;
    padding-top: 1em;
    gap: 1em;

    #search_bookAPI {
      align-content: center;
    }

    #list_book {
      display: grid;
      overflow-y: scroll;
      height: 100%;
      place-items: center;
      @media screen and (max-width: 900px) {
        place-items: baseline;
      }
      .book {
        border: 2px solid black;
        width: 80%;
        height: 20em;
        display: grid;
        grid-template: 10% 10% 80% / 50% 50%;
        margin: 2em;
        position: relative;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        @media screen and (max-width: 900px) {
          margin: 1em 0 1em 0;
        }

        &.test {
          filter: opacity(0.5);
          cursor: default !important;
        }

        &.test::before {
          content: '✔';
          grid-column: 1 / 3;
          grid-row: 1;
          background-color: green;
          width: 2em;
          height: 2em;
          font-size: 20px;
          border-radius: 50%;
          right: 0;
          transition: opacity 0.5s ease-in-out;
          position: absolute;
          z-index: 10;
          align-content: center;
          @media screen and (max-width: 900px) {
            font-size: 2em;
            width: 50px;
            height: 50px;
            opacity: 1;
            right: -25%;
          }
        }

        &:not(.test)::after {
          content: '+';
          grid-column: 1 / 3;
          grid-row: 1;
          background-color: black;
          font-size: 10em;
          width: 25%;
          height: 100%;
          opacity: 0;
          right: 0;
          transition: opacity 0.5s ease-in-out;
          position: absolute;
          z-index: 10;
          align-content: center;

          @media screen and (max-width: 900px) {
            font-size: 5em;
            width: 25%;
            height: 100%;
            opacity: 1;
            right: -25%;
          }
        }

        &:not(.test):hover::after {
          opacity: 1;
        }

        &.animation:not(.test)::after {
          opacity: 1;
          animation: test 0.5s forwards;
        }

        @keyframes test {
          0% {
            background-color: black;
            content: '+';
          }

          50% {
            background-color: green;
            content: '✔';
          }

          100% {
            background-color: green;
            content: '✔';
            width: 2em;
            height: 2em;
            font-size: 20px;
            border-radius: 50%;
          }
        }

        .title {
          grid-column: 1/3;
          grid-row: 1;
          display: flex;
          gap: 2em;
          place-content: center;

          b,p{
            width:15em;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

          }
        }

        .authors {
          grid-column: 1/3;
          grid-row: 2;
          display: flex;
          gap: 2em;
          place-content: center;
        }

        .description {
          grid-column: 1;
          grid-row: 3;
          padding: 1em;

          p {
            width: 100%;
            height: 100%;
            overflow: auto;
            padding: 1em;
          }
        }

        .image {
          grid-column: 2;
          grid-row: 3/4;
          align-content: center;
        }
      }
    }
    .add_book_button {
      button {
        padding: 10px;
        font-size: 1.2em;
        background-color: #017605;
        position: relative;
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        width: 100%;
        overflow: hidden;

        &::before {
          content: '';
          width: 100%;
          height: 100%;
          transform: rotateZ(45deg);
          display: block;
          background-color: #ffffff80;
          position: absolute;
          right: -10em;
          transition: right 0.5s ease-in-out;
        }
        &:hover::before {
          right: 10em;
        }
      }
    }
  }
</style>
