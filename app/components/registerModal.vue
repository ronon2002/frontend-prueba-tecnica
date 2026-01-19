<script setup lang="ts">
interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const { apiFetch } = useApi()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const resetForm = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Todos los campos son obligatorios'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true

  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      }
    })

    successMessage.value = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.'
    
    setTimeout(() => {
      emit('success')
      closeModal()
    }, 2000)

  } catch (error: any) {
    console.error('Error de registro:', error)
    errorMessage.value = error.data?.message || 'Error al crear la cuenta. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal :show="show" title="Crear cuenta" @close="closeModal">
    <div v-if="successMessage" class="mb-4 rounded-lg bg-green-500/10 border border-green-500/50 p-4">
      <p class="text-sm text-green-400">{{ successMessage }}</p>
    </div>

    <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
      <p class="text-sm text-red-400">{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="register-name" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Nombre completo
        </label>
        <input
          id="register-name"
          v-model="name"
          type="text"
          required
          placeholder="Juan Pérez"
          class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label for="register-email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Correo electrónico
        </label>
        <input
          id="register-email"
          v-model="email"
          type="email"
          required
          placeholder="tu@ejemplo.com"
          class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label for="register-password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Contraseña
        </label>
        <input
          id="register-password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label for="register-confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Confirmar contraseña
        </label>
        <input
          id="register-confirm-password"
          v-model="confirmPassword"
          type="password"
          required
          placeholder="••••••••"
          class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-2.5 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
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
          <span v-if="loading">Creando cuenta...</span>
          <span v-else>Crear cuenta</span>
        </button>
      </div>
    </form>
  </Modal>
</template>