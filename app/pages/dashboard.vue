<script setup lang="ts">
const { isDark } = useDarkMode()
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <SideBar />

    <main class="flex-1 p-8">
      <div class="max-w-4xl">
        <TaskList />
      </div>
    </main>
  </div>
</template>