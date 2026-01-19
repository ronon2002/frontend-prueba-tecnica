<script setup lang="ts">
interface Props {
  show: boolean
}

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  createdAt: string
  dueDate?: string
  category?: string
  userId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  created: [task: Task]
}>()

const { apiFetch } = useApi()

const title = ref('')
const description = ref('')
const dueDate = ref('')
const category = ref('')
const loading = ref(false)
const errorMessage = ref('')

const resetForm = () => {
  title.value = ''
  description.value = ''
  dueDate.value = ''
  category.value = ''
  errorMessage.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!title.value.trim()) {
    errorMessage.value = 'El título es obligatorio'
    return
  }

  loading.value = true

  try {
    const newTask = await apiFetch<Task>('/tasks', {
      method: 'POST',
      body: {
        title: title.value.trim(),
        description: description.value.trim() || undefined,
        dueDate: dueDate.value || undefined,
        category: category.value.trim() || undefined
      }
    })

    emit('created', newTask)
    resetForm()
  } catch (error: any) {
    console.error('Error al crear tarea:', error)
    errorMessage.value = error.data?.message || 'Error al crear la tarea'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal :show="show" title="Nueva Tarea" @close="closeModal">
    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
      <p class="text-sm text-red-400">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
            <label for="task-title" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Título <span class="text-red-500">*</span>
            </label>
            <input
            id="task-title"
            v-model="title"
            type="text"
            required
            placeholder="Ej: Completar informe mensual"
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
            />
        </div>

        <div>
            <label for="task-due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Fecha de vencimiento
            </label>
            <input
                id="task-due-date"
                v-model="dueDate"
                type="date"
                class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
        <div>
        <label
            for="task-category"
            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
        >
            Categoría
        </label>

        <select
            id="task-category"
            v-model="category"
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                py-2.5 px-4
                focus:ring-2 focus:ring-indigo-500 sm:text-sm"
        >
            <option value="" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            Sin categoría
            </option>
            <option value="Trabajo" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            Trabajo
            </option>
            <option value="Personal" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            Personal
            </option>
            <option value="Estudio" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            Estudio
            </option>
        </select>
        </div>

        <div>
            <label for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Descripción (opcional)
            </label>
            <textarea
            id="task-description"
            v-model="description"
            rows="3"
            placeholder="Agrega detalles sobre la tarea..."
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors resize-none"
            />
        </div>

        <div class="flex gap-3 pt-4">
            <button
            type="button"
            @click="closeModal"
            class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
            Cancelar
            </button>
            <button
            type="submit"
            :disabled="loading"
            class="flex-1 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <span v-if="loading">Creando...</span>
            <span v-else>Crear tarea</span>
            </button>
        </div>
    </form>
  </Modal>
</template>