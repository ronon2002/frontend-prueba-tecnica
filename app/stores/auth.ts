export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    hydrated: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    hydrate() {
      if (process.client && !this.hydrated) {
        this.token = localStorage.getItem('token')
        this.hydrated = true
      }
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
      navigateTo('/login')
    },
  },
})
