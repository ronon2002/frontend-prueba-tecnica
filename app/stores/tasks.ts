import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  createdAt: string
  dueDate?: string
  category?: string
  userId: number
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: '',
    showCreateModal: false,
    editingTask: null as Task | null,
  }),

  getters: {
    completedTasks: (state) => state.tasks.filter(t => t.completed),
    pendingTasks: (state) => state.tasks.filter(t => !t.completed),
    isEditing: (state) => state.editingTask !== null,
    
    filteredTasks: (state) => {
      return (searchQuery: string, category: string) => {
        let filtered = state.tasks

        // Filtrar por búsqueda
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(query) ||
            (task.description?.toLowerCase().includes(query) ?? false)
          )
        }

        // Filtrar por categoría
        if (category) {
          filtered = filtered.filter(task => task.category === category)
        }

        return filtered
      }
    },

    filteredPendingTasks: (state) => {
      return (searchQuery: string, category: string) => {
        const filtered = state.tasks.filter(t => !t.completed)
        let result = filtered

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          result = result.filter(task => 
            task.title.toLowerCase().includes(query) ||
            (task.description?.toLowerCase().includes(query) ?? false)
          )
        }

        if (category) {
          result = result.filter(task => task.category === category)
        }

        return result
      }
    },

    filteredCompletedTasks: (state) => {
      return (searchQuery: string, category: string) => {
        const filtered = state.tasks.filter(t => t.completed)
        let result = filtered

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          result = result.filter(task => 
            task.title.toLowerCase().includes(query) ||
            (task.description?.toLowerCase().includes(query) ?? false)
          )
        }

        if (category) {
          result = result.filter(task => task.category === category)
        }

        return result
      }
    },
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = ''

      try {
        const { apiFetch } = useApi()
        const data = await apiFetch<Task[]>('/tasks')
        this.tasks = data
      } catch (err: any) {
        console.error('Error al cargar tareas:', err)
        this.error = err.data?.message || 'Error al cargar las tareas'
      } finally {
        this.loading = false
      }
    },

    async toggleTask(task: Task) {
      try {
        const { apiFetch } = useApi()
        const updatedTask = await apiFetch<Task>(`/tasks/${task.id}/complete`, {
          method: 'PATCH',
        })

        const index = this.tasks.findIndex(t => t.id === task.id)
        if (index !== -1) this.tasks[index] = updatedTask
      } catch (err: any) {
        console.error('Error al actualizar tarea:', err)
        this.error = 'Error al actualizar la tarea'
      }
    },

    async deleteTask(taskId: number) {
      if (!confirm('¿Estás seguro de eliminar esta tarea?')) return

      try {
        const { apiFetch } = useApi()
        await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' })
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } catch (err: any) {
        console.error('Error al eliminar tarea:', err)
        this.error = 'Error al eliminar la tarea'
      }
    },

    openCreateModal() {
      this.editingTask = null
      this.showCreateModal = true
    },

    openEditModal(task: Task) {
      this.editingTask = task
      this.showCreateModal = true
    },

    handleTaskCreated(newTask: Task) {
      this.tasks.unshift(newTask)
      this.showCreateModal = false
      this.editingTask = null
    },

    handleTaskUpdated(updatedTask: Task) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id)
      if (index !== -1) {
        this.tasks[index] = updatedTask
      }
      this.showCreateModal = false
      this.editingTask = null
    },
  },
})