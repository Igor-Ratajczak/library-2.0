<template>
  <div class="window">
    <div class="edit_book_container">
      <button
        type="button"
        class="close"
        @click="$emit('close')"
      >
        X
      </button>
      <input
        id="title"
        v-model="title_text"
        type="text"
        name="title"
      >
      <input
        id="author"
        v-model="author_text"
        type="text"
        name="author"
      >
      <textarea
        id="description"
        v-model="description_text"
      />
      <div id="preview_image">
        <input
          v-model="image_link"
          type="image"
          :src="image_link"
          alt="preview book"
        >
      </div>

      <input
        id="image"
        v-model="image_link"
        type="text"
        name="image"
      >
      <button
        id="save"
        @click="onSave()"
      >
        {{ $t('save_book') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Book } from '../book/IDB/IDB'

export default defineComponent({
  props: {
    data: {
      type: Object as () => Book,
      required: true,
    },
  },
  emits: { save(payload: { data: Book }) {
    return payload.data
  }, close },
  data() {
    const title_text: Ref<string> = ref(this.data.title)
    const author_text: Ref<string> = ref(this.data.author)
    const description_text: Ref<string> = ref(this.data.description)
    const image_link: Ref<string> = ref(this.data.image)
    const book_data: Book = {
      title: title_text,
      book_id: this.data.book_id,
      author: author_text,
      publisher: this.data.publisher,
      publishedDate: this.data.publishedDate,
      description: description_text,
      image: image_link,
      favorite: this.data.favorite,
    }
    return {
      title_text,
      book_data,
      author_text,
      description_text,
      image_link,
    }
  },
  methods: {
    onSave() {
      this.$emit('save', { data: this.book_data })
    },
  },
})
</script>

<style scoped lang="less">
  .edit_book_container {
    display: grid;
    grid-template: 2fr 2fr 2fr 2fr / 50% 50%;
    width: 100%;
    height: 100%;
    justify-items: center;
    padding-top: 5em;

    input#title {
      grid-column: 2;
      grid-row: 1;
    }
    input#author {
      grid-column: 2;
      grid-row: 2;
    }
    textarea#description {
      grid-column: 2;
      grid-row: 3;
      border: none;
      outline: none;
      resize: none;
      background-color:  transparent;
      width: 100%;
      height: 100%;
    }
    div#preview_image {
      grid-column: 1;
      grid-row: 1/4;
      width: 100%;
      height: 100%;
      align-content: center;
      > input {
        width: max-content;
        height: max-content;
      }
    }
    input#image {
      grid-column: 1;
      grid-row: 4;
    }
  }
</style>
