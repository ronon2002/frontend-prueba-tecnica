// composables/useAuth.ts
export const useAuth = () => {
  const { apiFetch } = useApi()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const response = await apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        }
      })

      if (process.client && response.access_token) {
        localStorage.setItem('token', response.access_token)
      }

      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('token')
    }
    router.push('/login')
  }

  const getToken = () => {
    return process.client ? localStorage.getItem('token') : null
  }

  const isAuthenticated = computed(() => {
    return !!getToken()
  })

  const getCurrentUser = async () => {
    try {
      const user = await apiFetch('/auth/me')
      return { success: true, data: user }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.message || 'Error al obtener usuario' 
      }
    }
  }

  return {
    login,
    logout,
    getToken,
    isAuthenticated,
    getCurrentUser
  }
}