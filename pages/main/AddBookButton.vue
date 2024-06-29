<template>
  <div>
    <div
      class="add_book_button"
      @click="add_book = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="20"
        height="20"
        viewBox="0 0 200 200"
      >
        <line
          x1="0"
          y1="100"
          x2="200"
          y2="100"
        />
        <line
          x1="100"
          y1="0"
          x2="100"
          y2="200"
        />
      </svg>
    </div>
    <Teleport to="body">
      <AddBookContainer
        v-if="add_book"
        @close="add_book = false"
        @load-books="emitLoadBooks()"
      />
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddBookContainer from '../book/AddBookContainer.vue'

export default defineComponent({
  components: {
    AddBookContainer,
  },
  emits: ['load-books'],
  data() {
    return {
      add_book: false,
    }
  },
  methods: {
    emitLoadBooks() {
      this.$emit('load-books')
    },
  },
})
</script>

<style lang="less">
  .add_book_button {
    cursor: pointer;
    position: relative;
    z-index: 10000;
    display: grid;
    place-content: center;

    svg {
      background: transparent;
      stroke-width: 30;
      stroke: currentColor;
      transform: scale(1);
      fill: var(--color-text);
      transition: 0.2s transform ease-in-out;
    }
    svg:hover {
      transform: scale(1.5);
    }
  }
</style>
