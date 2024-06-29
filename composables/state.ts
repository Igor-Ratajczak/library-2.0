import { ref } from 'vue'

const currentPage: Ref<number> = ref(Number(new URLSearchParams(window.location.search).get('page')) || 1)
const currentSort: Ref<string> = ref(new URLSearchParams(window.location.search).get('sort') || 'title')
const addingBook: Ref<boolean> = ref(false)
const searchText: Ref<string> = ref(new URLSearchParams(window.location.search).get('search') || '')
const favorite: Ref<string> = ref(new URLSearchParams(window.location.search).get('type') || '')

export function useGlobalState() {
  return { currentPage, currentSort, addingBook, searchText, favorite }
}
