import { notificationData, Notification } from '../notification/notification'
/**
 *  Check connection and show notification if offline
 */
export function checkConnection() {
  // if offline
  if (!navigator.onLine) {
    // show message offline
    Notification(
      'info',
      notificationData[window.user_settings.language].info.offline,
    )
    // add event listener for online if before was be offline
    window.addEventListener('online', function () {
      Notification(
        'info',
        notificationData[window.user_settings.language].info.online,
      )
    })
  }
}
