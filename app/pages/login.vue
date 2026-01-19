<script setup lang="ts">
const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const showRegisterModal = ref(false)

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await login(email.value, password.value)

  if (result.success) {
    await router.push('/dashboard')
  } else {
    errorMessage.value = result.error
  }

  loading.value = false
}

const openRegisterModal = () => {
  showRegisterModal.value = true
}

const closeRegisterModal = () => {
  showRegisterModal.value = false
}

const handleRegisterSuccess = () => {
  // Opcional: podrías mostrar un mensaje de éxito aquí
  console.log('Usuario registrado exitosamente')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 py-12 lg:px-8">
    <div class="w-full max-w-md">
      <div class="text-center">
        <h1 class="mt-10 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Inicia sesión en tu cuenta
        </h1>
      </div>

      <div class="mt-10">
        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
          <p class="text-sm text-red-400">{{ errorMessage }}</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Correo electrónico
            </label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                placeholder="tu@ejemplo.com"
                class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contraseña
              </label>
            </div>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 py-3 px-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="loading">Iniciando sesión...</span>
              <span v-else>Iniciar sesión</span>
            </button>
          </div>

          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <label for="remember-me" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
              Recordar sesión
            </label>
          </div>
        </form>

        <!-- Botón de registro -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                ¿No tienes una cuenta?
              </span>
            </div>
          </div>

          <button
            @click="openRegisterModal"
            type="button"
            class="mt-4 w-full rounded-lg border-2 border-indigo-600 dark:border-indigo-500 bg-transparent px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200"
          >
            Crear cuenta nueva
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de registro -->
    <registerModal
      :show="showRegisterModal"
      @close="closeRegisterModal"
      @success="handleRegisterSuccess"
    />
  </div>
</template>