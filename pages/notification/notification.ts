interface notificationData {
  [language: string]: {
    info: {
      online: string
      offline: string
      pwa_offlineReady: string
    }
    error: {
      add_book: string
      load_book: string
      edit_book: string
      remove_book: string
      unknown: string
      getIndexedDB: string
      network: string
      upload: string
    }
  }
}

export const notificationData: notificationData = {
  pl: {
    info: {
      online: 'Jesteś online!',
      offline:
        'Jesteś offline! Ale spokojnie możesz dalej korzystać z aplikacji. :)',
      pwa_offlineReady: 'Aplikacja gotowa do pracy w trybie offline.',
    },
    error: {
      add_book: 'Coś poszło nie tak przy dodawaniu książki/książek!',
      load_book: 'Coś poszło nie tak przy ładowaniu książek!',
      edit_book: 'Coś poszło nie tak przy edytowaniu tej książki!',
      remove_book: 'Coś poszło nie tak przy kasowaniu tej książki!',
      unknown: 'Nieznany błąd!??',
      getIndexedDB:
        'Błąd podczas pobierania bazy danych indeksu. Proszę spróbuj ponownie.',
      network: 'Brak połączenia z internetem.',
      upload:
        'Nie można pobrać danych. Sprawdź połączenie lub spróbuj ponownie.',
    },
  },
  en: {
    info: {
      online: 'You are online!',
      offline: 'You are offline!',
      pwa_offlineReady: 'App ready to work offline.',
    },
    error: {
      add_book: 'Something went wrong while adding the book(s).',
      load_book: 'Something went wrong while load the book(s).',
      edit_book: 'Something went wrong while editing this book!',
      remove_book: 'Something went wrong when deleting this book!',
      unknown: 'Unknown error!??',
      getIndexedDB: 'Error get index database. Please try again.',
      network: '',
      upload: '',
    },
  },
}

let timeoutId: ReturnType<typeof setTimeout>
/**
 * Create a new notification element with the specified:
 * @param type type notification: info warning, error
 * @param text text of notification e.g 'Couldn't add book {error}
 * @returns
 */
function createNotificationElement(type: string, text: string): HTMLDivElement {
  // create notification element
  const notification = document.createElement('div')
  notification.classList.add('notification')
  notification.classList.add(type)

  // create notification title element
  const notification__title = document.createElement('h2')
  const __title = document.createTextNode(
    window.user_settings.language === 'en' ? 'Notification' : 'Powiadomienie',
  )
  notification__title.appendChild(__title)

  // create notification text element
  const notification_text = document.createElement('h3')
  const __text = document.createTextNode(text)
  notification_text.appendChild(__text)

  // create notification close button element
  const close = document.createElement('button')
  close.setAttribute('type', 'button')
  close.setAttribute('class', 'close')
  close.innerText = 'X'

  // add event click to close button
  close.addEventListener('click', () => {
    notification.remove()
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })
  // set timeout to remove notification after 10 seconds
  timeoutId = setTimeout(() => {
    notification.remove()
  }, 10_000)

  // create notification progress bar element
  const progressBar = document.createElement('div')
  progressBar.classList.add('progress_bar')

  // append all elements to notification
  notification.append(notification__title)
  notification.append(notification_text)
  notification.append(close)
  notification.append(progressBar)

  return notification
}
/**
 * Create a notification message using the:
 * @param type type notification: info warning, error
 * @param text text of notification e.g 'Couldn't add book {error}
 * @returns
 */
export async function Notification(type: string, text: string) {
  // get notification container element
  const notification_container = document.getElementById(
    'notification_container',
  )

  if (notification_container) {
    // remove class attribute and load new position if changed
    notification_container.removeAttribute('class')
    notification_container.classList.add(window.user_settings.notification.position)

    // create new notification element
    const newNotification = createNotificationElement(type, text)
    notification_container.append(newNotification)

    // Scroll to newest notification element
    notification_container.scrollTop = notification_container.scrollHeight
  }
  else {
    // create notification container element
    const notification_container = document.createElement('div')
    notification_container.setAttribute('id', 'notification_container')
    notification_container.classList.add(window.user_settings.notification.position)
    // append notification container to body
    document.body.append(notification_container)

    // return after create notification element
    return Notification(type, text)
  }
}
