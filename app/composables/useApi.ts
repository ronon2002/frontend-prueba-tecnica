export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase, // Toma el hostlocal de nestjs

    onRequest({ options }) {
      const token = process.client ? localStorage.getItem('token') : null
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        if (process.client) {
          localStorage.removeItem('token')
          router.push('/login') // ✅ SIEMPRE página frontend
        }
      }
    },
  })

  return { apiFetch }
}
