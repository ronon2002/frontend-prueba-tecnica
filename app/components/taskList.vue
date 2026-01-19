<script setup lang="ts">
interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  createdAt: string
  userId: number
}

const { apiFetch } = useApi()

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref('')
const showCreateModal = ref(false)

const fetchTasks = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await apiFetch<Task[]>('/tasks')
    tasks.value = data
  } catch (err: any) {
    console.error('Error al cargar tareas:', err)
    error.value = err.data?.message || 'Error al cargar las tareas'
  } finally {
    loading.value = false
  }
}

const toggleTask = async (task: Task) => {
  try {
    const updatedTask = await apiFetch<Task>(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: {
        completed: !task.completed
      }
    })

    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (err: any) {
    console.error('Error al actualizar tarea:', err)
    error.value = 'Error al actualizar la tarea'
  }
}

const deleteTask = async (taskId: number) => {
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return

  try {
    await apiFetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })

    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (err: any) {
    console.error('Error al eliminar tarea:', err)
    error.value = 'Error al eliminar la tarea'
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleTaskCreated = (newTask: Task) => {
  tasks.value.unshift(newTask)
  showCreateModal.value = false
}

onMounted(() => {
  fetchTasks()
})

const completedTasks = computed(() => tasks.value.filter(t => t.completed))
const pendingTasks = computed(() => tasks.value.filter(t => !t.completed))
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Mis Tareas
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ pendingTasks.length }} pendientes, {{ completedTasks.length }} completadas
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Tarea
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
    </div>

    <div v-else-if="error" class="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
      <p class="text-sm text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="tasks.length > 0" class="space-y-4">
      <div v-if="pendingTasks.length > 0">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Pendientes
        </h3>
        <div class="space-y-2">
          <div
            v-for="task in pendingTasks"
            :key="task.id"
            class="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
          >
            <button
              @click="toggleTask(task)"
              class="mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
            >
              <span v-if="task.completed" class="text-indigo-600 dark:text-indigo-400">✓</span>
            </button>

            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ task.title }}
              </h4>
              <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ task.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Creada {{ new Date(task.createdAt).toLocaleDateString('es-MX') }}
              </p>
            </div>

            <button
              @click="deleteTask(task.id)"
              class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="completedTasks.length > 0">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Completadas
        </h3>
        <div class="space-y-2">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 opacity-75 hover:opacity-100 transition-opacity"
          >
            <button
              @click="toggleTask(task)"
              class="mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 flex items-center justify-center"
            >
              <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-600 dark:text-gray-400 line-through">
                {{ task.title }}
              </h4>
              <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-500 mt-1 line-through">
                {{ task.description }}
              </p>
            </div>

            <button
              @click="deleteTask(task.id)"
              class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12">
      <svg class="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No tienes tareas
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Comienza creando tu primera tarea
      </p>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear tarea
      </button>
    </div>

    <CreateTaskModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
    />
  </div>
</template>