<script setup lang="ts">
import { onMounted } from 'vue'
import { useTasksStore } from '~/stores/tasks'

const tasksStore = useTasksStore()

onMounted(() => {
  tasksStore.fetchTasks()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Mis Tareas
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ tasksStore.pendingTasks.length }} pendientes,
          {{ tasksStore.completedTasks.length }} completadas
        </p>
      </div>
      <button
        @click="tasksStore.openCreateModal"
        class="flex items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Tarea
      </button>
    </div>

    <ClientOnly>
        <div v-if="tasksStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>

        <div v-else-if="tasksStore.error" class="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
        <p class="text-sm text-red-400">{{ tasksStore.error }}</p>
        </div>
            <div v-else-if="tasksStore.tasks.length > 0" class="space-y-4">
            <div v-if="tasksStore.pendingTasks.length > 0">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Pendientes
                </h3>
                <div class="space-y-2">
                <div
                    v-for="task in tasksStore.pendingTasks"
                    :key="task.id"
                    class="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                    <button
                    @click="tasksStore.toggleTask(task)"
                    class="mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                    >
                    <span v-if="task.completed" class="text-indigo-600 dark:text-indigo-400">✓</span>
                    </button>

                    <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h4>
                    <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ task.description }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Creada {{ new Date(task.createdAt).toLocaleDateString('es-MX') }}
                    </p>
                    </div>

                    <div class="flex-shrink-0 flex gap-1">
                    <button
                        @click="tasksStore.openEditModal(task)"
                        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        @click="tasksStore.deleteTask(task.id)"
                        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <div v-if="tasksStore.completedTasks.length > 0">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Completadas
                </h3>
                <div class="space-y-2">
                <div
                    v-for="task in tasksStore.completedTasks"
                    :key="task.id"
                    class="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 opacity-75 hover:opacity-100 transition-opacity"
                >
                    <button
                    @click="tasksStore.toggleTask(task)"
                    class="mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 flex items-center justify-center"
                    >
                    <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    </button>

                    <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-600 dark:text-gray-400 line-through">{{ task.title }}</h4>
                    <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-500 mt-1 line-through">{{ task.description }}</p>
                    </div>

                    <div class="flex-shrink-0 flex gap-1">
                    <button
                        @click="tasksStore.openEditModal(task)"
                        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        @click="tasksStore.deleteTask(task.id)"
                        class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>

        <div v-else class="flex flex-col items-center justify-center py-12">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tienes tareas</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Comienza creando tu primera tarea</p>
        <button
            @click="tasksStore.openCreateModal"
            class="flex items-center gap-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
        >
            Crear tarea
        </button>
        </div>
        <CreateTaskModal
        :show="tasksStore.showCreateModal"
        :task="tasksStore.editingTask"
        @close="tasksStore.showCreateModal = false"
        @created="tasksStore.handleTaskCreated"
        @updated="tasksStore.handleTaskUpdated"
        />
    </ClientOnly>
  </div>
</template>