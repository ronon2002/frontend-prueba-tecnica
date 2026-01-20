<script setup lang="ts">
interface Props {
  searchQuery: string
  selectedCategory: string
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedCategory', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Trabajo', label: 'Trabajo' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Estudio', label: 'Estudio' },
]

const updateSearch = (value: string) => {
  emit('update:searchQuery', value)
}

const updateCategory = (value: string) => {
  emit('update:selectedCategory', value)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <!-- Buscador -->
    <div class="flex-1">
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          :value="searchQuery"
          @input="updateSearch(($event.target as HTMLInputElement).value)"
          placeholder="Buscar tareas..."
          class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
        />
      </div>
    </div>

    <!-- Filtro por categoría -->
    <div class="sm:w-64">
      <select
        :value="selectedCategory"
        @change="updateCategory(($event.target as HTMLSelectElement).value)"
        class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
      >
        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
          class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {{ category.label }}
        </option>
      </select>
    </div>
  </div>
</template>