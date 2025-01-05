export interface UserSettings {
  backgroundColor: string
  textColor: string
  language: string
  notification: {
    position: string
  }
}

// declare global user settings
declare global {
  interface Window {
    user_settings: UserSettings
  }
}
// get user settings from local storage
const settingsLocalStorage: UserSettings = JSON.parse(localStorage.getItem('library-2.0-settings') as string)

// set user settings
const default_user_settings: UserSettings = {
  backgroundColor:
  settingsLocalStorage ? settingsLocalStorage.backgroundColor : '#230b9d',
  textColor: settingsLocalStorage ? settingsLocalStorage.textColor : '#ffffff',
  language: settingsLocalStorage ? settingsLocalStorage.language : navigator.language,
  notification: {
    position:
    settingsLocalStorage ? settingsLocalStorage.notification.position : 'bottom_right',
  },
}
window.user_settings = default_user_settings
/**
 * Set user settings
 */
export function SetUserSettings(): void {
  // Set background
  document.body.style.setProperty(
    '--background',
    window.user_settings.backgroundColor,
  )
  // Set color
  document.body.style.setProperty(
    '--color-text',
    window.user_settings.textColor,
  )
  // Set settings to local storage
  localStorage.setItem('library-2.0-settings', JSON.stringify(window.user_settings))
}
