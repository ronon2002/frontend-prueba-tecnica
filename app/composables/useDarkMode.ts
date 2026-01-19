export const useDarkMode = () => {
  const isDark = useState<boolean>('dark-mode', () => {
    if (process.client) {
      const saved = localStorage.getItem('dark-mode')
      return saved ? saved === 'true' : true
    }
    return true
  })

  const toggleDarkMode = () => {
    isDark.value = !isDark.value

    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      
      localStorage.setItem('dark-mode', String(isDark.value))
    }
  }

  const setDarkMode = (value: boolean) => {
    isDark.value = value
    
    if (process.client) {
      document.documentElement.classList.toggle('dark', value)
      localStorage.setItem('dark-mode', String(value))
    }
  }

  onMounted(() => {
    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  })

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    setDarkMode
  }
}