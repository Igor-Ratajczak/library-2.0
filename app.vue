<template>
  <NuxtPwaManifest />
  <NuxtPage />
  <PromptUpdatePWA />
</template>

<script setup lang="ts">
import PromptUpdatePWA from './pages/PromptUpdatePWA.vue'

useSeoMeta({
  title: 'Library 2.0',
  description: 'Strona stworzona, abyś mógł stworzyć własną bibliotekę.',
  themeColor: '#000000',
})
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }],
})
</script>
