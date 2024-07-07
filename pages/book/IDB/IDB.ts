import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

//  Definition of the Book interface
export interface Book {
  book_id: string
  title: string | Ref<string>
  author: string | Ref<string>
  publisher: string
  publishedDate: string
  description: string | Ref<string>
  image: string | Ref<string>
  favorite: boolean
}

// Definition of the database schema
interface LibraryDB extends DBSchema {
  Books: {
    value: Book
    key: string
  }
}

export class LibraryDatabase {
  private dbPromise: Promise<IDBPDatabase<LibraryDB>>

  constructor() {
    this.dbPromise = openDB<LibraryDB>('Library', 1, {
      upgrade(db) {
        db.createObjectStore('Books', { keyPath: 'id', autoIncrement: true })
      },
    })
  }

  /**
   * Get all books from the indexed database.
   * @returns Promise with an array of all books.
   */
  public async getAllBooks(): Promise<Book[]> {
    const db = await this.dbPromise
    return db.getAll('Books')
  }

  /**
   * Add a new books to the indexed database.
   * @param data Array of books to be added.
   */
  public async addBooks(data: Book[]): Promise<void> {
    const db = await this.dbPromise
    const tx = db.transaction('Books', 'readwrite')
    for (const book of data) {
      await tx.store.put({
        author: book.author,
        book_id: book.book_id,
        title: book.title,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        description: book.description,
        image: book.image,
        favorite: false,
      })
    }
    await tx.done
  }

  /**
   * Filter books by specific type and value.
   * @param type Filter type (e.g. 'book_id').
   * @param value Filter value.
   * @returns Promise with an array of books that fit the filter.
   */
  public async filterIDB(type: keyof Book, value: string): Promise<boolean[]> {
    const db = await this.dbPromise
    const books = await db.getAll('Books')
    const returnedValue: Array<boolean> = []
    books.filter((book: Book) => {
      if (book[type] === value) returnedValue.push(true)
    })
    return returnedValue
  }

  /**
   * Remove a book from the indexed database.
   * @param book Book to be removed.
   */
  public async removeBook(book: Book): Promise<void> {
    const db = await this.dbPromise
    const tx = db.transaction('Books', 'readwrite')
    const store = tx.objectStore('Books')
    let cursor = await store.openCursor()

    // Iterate on the cursor, row by row
    while (cursor) {
      // Check if the cursor book_id is the same as the current book_id
      if (cursor.value.book_id === book.book_id) {
        // Remove the book
        await store.delete(cursor.key)
        break
      }
      // Move to the next row
      cursor = await cursor.continue()
    }
    await tx.done
  }

  /**
   *  Toggle favorite book in the indexed database.
   * @param book Book to toggle favorite
   */
  public async favoriteBook(book: Book): Promise<void> {
    const db = await this.dbPromise
    const tx = db.transaction('Books', 'readwrite')
    const store = tx.objectStore('Books')
    let cursor = await store.openCursor()

    // Iterate on the cursor, row by row
    while (cursor) {
      // Check if the cursor book_id is the same as the current book_id
      if (cursor.value.book_id === book.book_id) {
        // Get the book
        const updatedBook = cursor.value
        if (updatedBook) {
          // Toggle the favorite status
          updatedBook.favorite = !updatedBook.favorite
          // Put the updated book
          await store.put(updatedBook)
        }
        break
      }
      // Move to the next row
      cursor = await cursor.continue()
    }
    await tx.done
  }

  // TODO Implement method to edit books
  /**
   * Edit a book in the indexed database.
   * @param book Book to be edited.
   * @description Edit only the title, author, description and image link
   */
  public async editBook(book: Book) {
    const db = await this.dbPromise
    const tx = db.transaction('Books', 'readwrite')
    const store = tx.objectStore('Books')
    let cursor = await store.openCursor()

    // Iterate on the cursor, row by row
    while (cursor) {
      // Check if the cursor book_id is the same as the current book_id
      if (cursor.value.book_id === book.book_id) {
        // Get the book
        const updatedBook = cursor.value
        if (updatedBook) {
          // Update the book
          updatedBook.title = book.title
          updatedBook.author = book.author
          updatedBook.description = book.description
          updatedBook.image = book.image
          // Put the updated book
          await store.put(updatedBook)
        }
        break
      }
      // Move to the next row
      cursor = await cursor.continue()
    }
    await tx.done
  }
}
