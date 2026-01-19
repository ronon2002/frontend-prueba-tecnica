<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()

const logout = () => {
  auth.logout()
}
</script>

<template>
  <aside
    class="flex h-screen w-64 flex-col bg-gray-800 text-gray-100 dark:bg-gray-950 border-r border-gray-700 dark:border-gray-800"
  >
    <div class="px-6 py-5 text-xl font-bold tracking-wide">
      Task Manager
    </div>

    <nav class="flex-1 px-4 space-y-2">
    </nav>

    <!-- Footer -->
    <div class="border-t border-gray-700 dark:border-gray-800 p-4 space-y-3">
      <!-- Botón Tema -->
      <button
        @click="toggleDarkMode"
        class="flex w-full items-center justify-center rounded-lg bg-gray-700 dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition"
      >
        <span v-if="isDark">Modo Oscuro</span>
        <span v-else>Modo Claro</span>
      </button>

      <!-- Botón Cerrar Sesión -->
      <button
        @click="logout"
        class="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  </aside>
</template>