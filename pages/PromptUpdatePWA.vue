<template>
  <!-- You can use $pwa directly in templates! -->
  <div v-show="$pwa.needRefresh">
    <span>
      {{ $t('pwa_needRefresh') }}
    </span>

    <button @click="$pwa.updateServiceWorker()">
      {{ $t('reload') }}
    </button>
  </div>
</template>

<script lang="ts">
import { Notification, notificationData } from './notification/notification'

export default defineComponent({
  setup() {
    const { $pwa } = useNuxtApp()
    onMounted(() => {
      if ($pwa?.offlineReady)
        Notification('error', notificationData[window.user_settings.language].info.pwa_offlineReady)
    })
  },
})
</script>
