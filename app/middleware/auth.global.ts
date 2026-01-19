export default defineNuxtRouteMiddleware((to) => {
  const token = process.client ? localStorage.getItem('token') : null

  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (token && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})
