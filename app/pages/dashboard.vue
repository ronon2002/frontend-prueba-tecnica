<script setup lang="ts">
const { isDark } = useDarkMode()
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <sideBar />

    <main class="flex-1 p-8 text-gray-900 dark:text-gray-100">
      <h1 class="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <p class="text-gray-600 dark:text-gray-400">
        Bienvenido, aquí puedes gestionar tus tareas.
      </p>
    </main>
  </div>
</template>