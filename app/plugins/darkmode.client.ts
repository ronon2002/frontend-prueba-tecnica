export default defineNuxtPlugin(() => {
  if (process.client) {
    const isDark = useState<boolean>('dark-mode', () => true)
    
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})