export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (process.client && !auth.token) {
    const token = localStorage.getItem('token')
    if (token) {
      auth.setToken(token)
    }
  }

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
