<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Library 2.0',
  description: 'Strona stworzona, abyś mógł stworzyć własną bibliotekę.',
  themeColor: '#000000',
  ogImage: './favicon.ico',
})
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: 'favicon.ico' }],
})
</script>
