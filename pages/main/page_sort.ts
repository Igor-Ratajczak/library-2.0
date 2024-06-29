import MiniSearch, { type SearchResult } from 'minisearch'
import type { Book } from '../book/IDB/IDB'

export class page_sort {
  private allBooks: Book[]
  constructor() {
    this.allBooks = []
  }

  /**
   * Updates the URL with the current page number and sort option.
   * @param page - The current page number.
   * @param sort - The current sort option.
   * @param search - The current search text.
   */
  public updateURL(page: string, sort: string, search: string, favorite: string): void {
    const urlParams = new URLSearchParams(window.location.search) // Create a new URLSearchParams object using the current URL's search parameters
    urlParams.set('page', page) // Set the 'page' parameter to the provided page value
    urlParams.set('sort', sort) // Set the 'sort' parameter to the provided sort value
    if (favorite === 'favorite') {
      urlParams.set('type', 'favorite') // Set the 'favorite' parameter to the true
      urlParams.delete('search') // Delete the 'search' parameter if it is "all_favorite__book"
    }
    else {
      urlParams.delete('type') // Delete the 'favorite' parameter
    }
    if (search !== '') {
      urlParams.set('search', search)// Set the 'search' parameter to the provided search text
    }
    else {
      urlParams.delete('search') // Delete the 'search' parameter if it is empty
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}` // Construct a new URL by combining the pathname of the current URL with the search parameters as a query string
    window.history.pushState(null, document.title, newUrl) // Update the URL with the new URL using the history.pushState method
  }

  /**
   * Sorts the list of books based on the specified type.
   *
   * @param allBooks - The list of all books.
   * @param type - The type of sorting (title, author, description, or published).
   * @returns - The sorted list of books.
   */
  public SortBooks(allBooks: Book[], type: string) {
    switch (type) {
      case 'title':
      case 'author':
      case 'description':
        // Sort books by title, author, or description in alphabetical order
        allBooks.sort((a, b) => {
          const nameA = (a[type] as string).toUpperCase() // ignore upper and lowercase
          const nameB = (b[type] as string).toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        break
      case 'newest':
        // Sort books by published date in newest order
        allBooks.sort(
          (a, b) => {
            const _a = Number(a.publishedDate.substring(0, 4))
            const _b = Number(b.publishedDate.substring(0, 4))
            return Number(_b - _a)
          },

        )
        break
      case 'older':
        // Sort books by published date in older order
        allBooks.sort(
          (a, b) => {
            const _a = Number(a.publishedDate.substring(0, 4))
            const _b = Number(b.publishedDate.substring(0, 4))
            return _a - _b
          },
        )
        break
      default:
        break
    }
    return allBooks
  }

  /**
   * Generates pagination numbers based on the total number of books and the current page.
   * Handles cases where the total number of pages is greater than 5, and displays an ellipsis (...) to indicate skipped pages.
   *
   * @param allBooks - The list of all books.
   * @param n - The current page number.
   * @returns - An array of pagination numbers, including ellipses for skipped pages.
   */
  public NumberPages(allBooks: Book[], n: number) {
    const totalPages = Math.ceil(allBooks.length / 10) // Calculate the total number of pages
    const data: Ref<Array<number | string>> = ref([]) // Initialize an empty array to store the pagination numbers

    // Check if the total number of pages is greater than 5
    if (totalPages > 5) {
      switch (n) {
        case 1:
        case 2:
        case 3:
        case 4:
          // For the first few pages, display numbers 1 to 5 and the total number of pages
          data.value.push(1, 2, 3, 4, 5, '...', totalPages)
          break
        case totalPages:
        case totalPages - 1:
        case totalPages - 2:
        case totalPages - 3:
          // For the last few pages, display numbers 1 and an ellipsis, followed by the last few pages
          data.value.push(
            1,
            '...',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          )
          break
        case n:
          // For any other middle page, display numbers 1 and an ellipsis, followed by the current page and its neighbors, and the total number of pages
          data.value.push(
            1,
            '...',
            n - 2,
            n - 1,
            n,
            n + 1,
            n + 2,
            '...',
            totalPages,
          )
          break
        default:
          break
      }
    }
    else {
      // If the total number of pages is less than or equal to 5, display all the page numbers
      for (let index = 0; index < totalPages; index++) {
        data.value.push(index + 1)
      }
    }
    return data // Return the array of pagination numbers
  }

  public searchBook(allBooks: Book[], value: string) {
    if (value === 'all_favorite__book') {
      return (allBooks as Book[]).filter((book: Book) => book.favorite)
    }
    else {
      const data: Book[] = []
      const miniSearch = new MiniSearch({
        fields: ['title', 'author', 'description'], // fields to index for full-text search
        storeFields: ['book_id', 'title', 'author', 'description', 'publisher', 'publishedDate', 'image', 'favorite'], // fields to return with search results
      })

      miniSearch.addAll(allBooks)
      const results: SearchResult[] = miniSearch.search(value)
      results.forEach((result: SearchResult) => {
        data.push({
          book_id: result.book_id,
          title: result.title,
          author: result.author,
          publisher: result.publisher,
          publishedDate: result.publishedDate,
          description: result.description,
          image: result.image,
          favorite: result.favorite,
        })
      })
      return data
    }
  }
}
