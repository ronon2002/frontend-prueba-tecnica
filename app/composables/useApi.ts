export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  authStore.hydrate()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`,
        }
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
      }
    },
  })

  return { apiFetch }
}
